const { default: mongoose } = require('mongoose')
const books = require('../model/bookModel')
const savedbooks = require('../model/savedBook')
const reservedbooks = require('../model/reservedModel')
const borrows = require('../model/borrowModel')
exports.addBookController = async (req, res) => {
    const { bookname, author, bookImg, category, availabilty } = req.body
    try {
        let currentBook = await books.findOne({ bookname })
        if (currentBook) {
            return res.status(406).json('Book already exists')
        } else {
            const newBook = new books({
                bookname, author, bookImg, category, availabilty, status: "Available"
            })
            await newBook.save()
            res.status(200).json(newBook)
        }
    } catch (error) {
        return res.status(401).json(error)
    }
}
exports.removeBookController = async(req,res)=>{
    const {bookId } = req.params;
        
    
   let deletedBook = await books.findByIdAndDelete(bookId)
    try {
       res.status(200).json(deletedBook) 
    } catch (error) {
        res.status(401).json(error)
    }
}
exports.allBookController = async (req, res) => {
    let allBook = await books.find()
    try {
        if (allBook) {
            res.status(200).json(allBook)
        } else {
            res.status(406).json('No books')
        }
    } catch (error) {
        res.status(401).json(error)
    }
}

exports.savedBookController = async (req, res) => {
    const { userId, sBook } = req.body;
    
    
    if (!Array.isArray(sBook)) {
        console.error('sBook is not an array');
        return res.status(400).send('Invalid sBook format');
    }

    try {
        let currentSaved = await savedbooks.findOne({ userId });

        if (currentSaved) {
            // Deduplicate the incoming books
            const existingBooks = currentSaved.booksaved.map(book => book._id.toString());
            const uniqueNewBooks = sBook.filter(book => !existingBooks.includes(book._id.toString()));

            // Deduplicate newBooks to avoid sending duplicates in the request
            const uniqueBooks = Array.from(new Set(uniqueNewBooks.map(book => book._id.toString())))
                .map(id => {
                    return uniqueNewBooks.find(book => book._id.toString() === id);
                });

            if (uniqueBooks.length > 0) {
                currentSaved.booksaved.push(...uniqueBooks);
                await currentSaved.save();
                res.status(200).json({ message: 'Books saved successfully', savedbooks: currentSaved.booksaved });
            } else {
                res.status(400).json({ message: 'All books are already saved' });
            }
        } else {
            const newSavedBooks = new savedbooks({
                userId,
                booksaved: sBook
            });

            await newSavedBooks.save();
            res.status(200).json({ message: 'Books saved successfully', savedbooks: newSavedBooks.booksaved });
        }
    } catch (error) {
        console.error('Error saving books:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



exports.getSavedBookController = async (req, res) => {
    const userId = req.params.userId

    // Check if userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID format' });
    }

    try {
        const savedBuk = await savedbooks.findOne({ userId })
        console.log(`saved book ${savedBuk}`);


        if (savedBuk) {
            res.status(200).json({ savedBuk: savedBuk.booksaved })
        } else {
            res.status(400).json('No saved book for this user')
        }
    } catch (error) {
        res.status(401).json(error)

    }
}

exports.deleteSavedBookController = async (req, res) => {
    const { userId, bookId } = req.params;

    try {
        // Validate userId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }

        // Validate bookId
        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).json({ message: 'Invalid book ID format' });
        }

        // Find and update the saved books
        const result = await savedbooks.findOneAndUpdate(
            { userId },
            { $pull: { booksaved: { _id: bookId } } },
            { new: true } // Return the updated document
        );

        if (result) {
            res.status(200).json({ message: 'Book deleted successfully', savedbooks: result.booksaved });
        } else {
            res.status(404).json({ message: 'User or book not found' });
        }
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.reserveBookController = async (req, res) => {
    const userId = req.params.userId;
    const { bookId, username, bookName, author, availabilty } = req.body;
    console.log(req.body);

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        const reservedBook = new reservedbooks({
            userId,
            bookId,
            username,
            bookName,
            author,
            availablity: availabilty
        });

        await reservedBook.save();

        res.status(201).json({ message: 'Book reserved successfully', reservedBook });
    } catch (error) {
        console.error('Error reserving book:', error);
        res.status(500).json({ message: 'Error reserving book', error });
    }
};

exports.getReservedBooks = async (req, res) => {
    try {

        const reservedBooks = await reservedbooks.find().populate('bookId').populate('userId');
        res.status(200).json(reservedBooks);
    } catch (error) {
        console.error('Error fetching reserved books:', error);
        res.status(500).json({ message: 'Error fetching reserved books', error });
    }
};

exports.rejectReservedBook = async (req, res) => {
    const { userId, bookId } = req.params;
    try {



        await reservedbooks.findOneAndDelete({ userId, bookId });

        res.status(200).json({ message: 'Reservation rejected and removed' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to reject reservation', error });
    }
};


exports.borrowBooks = async (req, res) => {
    const { userId, bookId, username, bookName, author, issueDate } = req.body;

    try {
        // Parse issueDate and calculate returnDate
        const parsedIssueDate = new Date(issueDate);
        if (isNaN(parsedIssueDate.getTime())) {
            return res.status(400).json({ message: 'Invalid issueDate format' });
        }

        const returnDate = new Date(parsedIssueDate);
        returnDate.setDate(parsedIssueDate.getDate() + 7);

        // Create and save the borrowed book record
        const borrowedBook = new borrows({
            userId,
            bookId,
            username,
            bookName,
            author,
            reserveDate: parsedIssueDate,
            returnDate,
        });

        await borrowedBook.save();

        // Optionally remove the reservation from ReservedBook collection
        // await ReservedBook.findOneAndDelete({ userId, bookId });

        res.status(201).json({ message: 'Reservation accepted and recorded', borrowedBook });
    } catch (error) {
        console.error('Error accepting reservation:', error);
        res.status(500).json({ message: 'Failed to accept reservation', error });
    }
};

exports.getAcceptedReservations = async (req, res) => {
    try {
        const reservations = await borrows.find()


        res.status(200).json(reservations);
    } catch (error) {
        console.error('Failed to fetch accepted reservations:', error);
        res.status(500).json({ message: 'Failed to fetch accepted reservations', error });
    }
};



exports.getUserBorrowedBooks = async (req, res) => {
    const { userId } = req.params;


    try {
        const reservations = await borrows.find({ userId })


        res.status(200).json(reservations);
    } catch (error) {
        console.error('Failed to fetch user borrowed books:', error);
        res.status(500).json({ message: 'Failed to fetch user borrowed books', error });
    }
};

exports.returnBook = async (req, res) => {
    const { id } = req.params;

    try {

        const result = await borrows.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        res.status(200).json({ message: 'Reservation returned successfully' });
    } catch (error) {
        console.error('Error returning book:', error);
        res.status(500).json({ message: 'Failed to return reservation', error });
    }
};


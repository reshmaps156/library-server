const express = require('express')
const router = new express.Router()
const userController = require('./controller/userController')
const bookController = require('./controller/bookController')
const jwtMid = require('./middleware/jwtMiddlware')
//register
router.post('/register',userController.registerController)
//login
router.post('/login',userController.loginController)
//add book
router.post('/add-book',bookController.addBookController)
//delete book
router.delete('/remove-book/:bookId',bookController.removeBookController)
//get all books
router.get('/allbooks',bookController.allBookController)
//save book
router.post('/save-book',bookController.savedBookController)
//get saved
router.get('/save-book/:userId',bookController.getSavedBookController)
//deleted saved
router.delete('/delete-book/:userId/:bookId', bookController.deleteSavedBookController);
// to add to reserved book
router.post('/reserve-book/:userId', jwtMid, bookController.reserveBookController);
//get reserved
router.get('/reserved-books', bookController.getReservedBooks);
//reject reerved
router.delete('/reserved-book/:userId/:bookId', bookController.rejectReservedBook);
//accept reserved
router.post('/accept-reservation', bookController.borrowBooks);

router.get('/accepted-reservations',bookController.getAcceptedReservations)

router.get('/user-borrowed-books/:userId', bookController.getUserBorrowedBooks);

router.delete('/return-book/:id', bookController.returnBook);

module.exports = router






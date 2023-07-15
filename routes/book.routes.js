const {Router}  = require("express")
const auth = require("../middlewares/auth.middleware")
const BookModel = require("../modles/book.modle")
const limiter = require("../middlewares/rateLimiter.middleware")

const bookRouter = Router();

bookRouter.use(auth)
bookRouter.use(limiter)

bookRouter.post("/add", async(req, res)=>{
    try {
        let book = await new BookModel(req.body);
        book.save();
        res.status(200).json({msg: "Book added", addBook: book});
    } catch (err) {
        res.status(400).send({error: err.message});
    }
})

bookRouter.get('/', async(req, res)=>{
    try {
        let books = await BookModel.find();
        res.status(200).json(books);
    } catch (err) {
        res.status(400).send({error: err.message});
    }
})

bookRouter.patch("/update/:id", async (req, res)=>{
    const {id} = req.params;
    try {
        let book  = await BookModel.findByIdAndUpdate({_id: id}, req.body);
        res.status(200).json({msg: "Book has been updated"})
    } catch (err) {
        res.status(400).send({error: err.message});
    }
});


bookRouter.delete("/delete/:id", async(req, res)=>{
    const {id} = req.params;
    try {
        let book  = await BookModel.findByIdAndDelete({_id: id}, req.body);
        res.status(200).json({msg: "Book has been deleted"})
    } catch (err) {
        res.status(400).send({error: err.message});
    }
})

module.exports = bookRouter;
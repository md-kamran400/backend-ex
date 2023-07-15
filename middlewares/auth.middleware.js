
const jwt = require("jsonwebtoken");
const BlackListmodel = require("../modles/token.modle");

const auth = async(req, res, next)=>{
    try {
        const token = req.headers.authorization?.split(" ")[1]||null;
        if(token){
            let existingToken = await BlackListmodel.find({
                blacklist: {$in: token},
            });

            if(existingToken.length > 0){
                return res.status(400).send({error: "Please login again!"});
            }

            let decode = jwt.verify(token, "masai");
            req.body.userId = decode.userId;

            return next();
        }
        else{
            res.status(400).send("Please Login First.")
        }
    } catch (error) {
        return res.status(400).send(err)
    }
}

module.exports = auth;
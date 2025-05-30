const authService = require("../services/login");

async function login(req, res){
    try {
        const {email, password} = req.body;
        const {token, user} = await authService.login(email, password);
        res.json({
            token: token,
            customer: user
        });   
    } catch (error) {
        res.status(401).json({message: "Tài khoản hoặc mật khẩu không chính xác"});
    }
}

module.exports = {
    login
}
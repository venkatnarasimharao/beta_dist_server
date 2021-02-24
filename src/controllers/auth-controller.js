// const Users = require('../models/user');
const Users = require('../models/Users');
const library = require('../libraries/userquery');
const Otp_verification = require('../models/Otp_verification');
const Joi = require('joi');
const validator = require('express-joi-validation').createValidator({});
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const cryptoRandomString = require('crypto-random-string');
const moment = require('moment');
const { request } = require('chai');
const { response } = require('express');
const { async } = require('crypto-random-string');

// user sign up API
module.exports.userSignup = async (request, response) => {

    console.log('request body isss', request.body);

    let validate = false;

    // Validation starts for request body
    const schema = Joi.object({
        userid: Joi.number().required().allow(0, null),
        name: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
        mobile: Joi.string().required(),
        role: Joi.string().required(),
        points: Joi.number().required(),
        status: Joi.number().required()
    })

    await validator.query(request.body, schema, (err) => {
        console.log("Validation response issss", err);
        if (err && err.details.length) {
            validate = true;
        }
    })

    if (validate) {
        return response.status(200).json({
            success: false,
            statusCode: 500,
            message: 'Validation Error, Invalid credentials.',
            data: []
        });
    }

    try {
        // user password encryption process
        const saltRounds = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(request.body.password, saltRounds);
        const encrytPassword = await library.encrypt(hashPassword, process.env.SECURITY_KEY);
        request.body.password = encrytPassword;

        request.body.facebook_id  = null;
        request.body.google_id = null;
        request.body.gender = null;
        request.body.dob = null;
        request.body.address = null;
        request.body.website = 'www.bacata.com';
        request.body.brief = null;
        request.body.image = 'assets/images/avatar.png';
        request.body.is_admin = 0;
        request.body.is_active = 0;
        request.body.confirmed = 1;
        request.body.confirmation_code = null;
        request.body.remember_token = null;
        request.body.provider = 'BACATA';
        request.body.login_time = null;
        request.body.logout_time = null;

        await library.insertOrUpdate(request, Users, [request.body]).then(result => {
            console.log("Get response user signup", result);
            return response.status(200).json({
                success: true,
                statusCode: 200,
                message: 'Signup successful',
                data: result
            });
        }).catch(err => {
            console.log('Failed to register a user', err);
            return response.status(200).json({
                success: false,
                statusCode: 403,
                message: 'Failed to register a user',
                data: null
            });
        })
    } catch (error) {
        console.log('Error at Try Catch API', error);
        return response.status(200).json({
            success: false,
            statusCode: 500,
            message: 'Error while user signup',
            data: null
        });
    }
}

// user login API
module.exports.userLogin = async (request, response) => {
    console.log('request body iss', request.body);

    if (!request.body.email || !request.body.password) {
        return response.status(200).json({
            message: 'Invalid username and password'
        })
    }

    try {
        const findUser = await library.simpleselect(Users, '*', `email='${request.body.email}'`);

        console.log("Get user login response", findUser);

        if (!findUser || findUser.length == 0) {
            return response.status(200).json({
                success: false,
                statusCode: 404,
                message: 'Invalid email or email not registered',
                data: null
            });
        }

        // user password decryption process
        const decryptPassword = await library.decrypt(findUser[0].password, process.env.SECURITY_KEY);

        const isPassword = bcrypt.compare(request.body.password, decryptPassword);

        if (!isPassword) {
            return response.status(200).json({
                success: false,
                statusCode: 404,
                message: 'Password not match',
                data: null
            });
        }

        const token = jwt.sign({
            email: findUser[0].email,
            password: findUser[0].password,
        }, process.env.SECURITY_KEY, {
            algorithm: 'HS256',
            expiresIn: '1hr'
        });

        // Insert Logged In Users (Login_time, Is_active, Remember_token)
        const loginPayload = {
            id: findUser[0].id,
            login_time: moment().format('YYYY-MM-DD HH:mm:ss'),
            is_active: 1,
            remember_token: token
        }

        console.log('User login payload', loginPayload);

        await library.insertOrUpdate(request, Users, loginPayload).catch(err => {
            throw err;
        });

        findUser[0].login_time = loginPayload.login_time;
        findUser[0].is_active = loginPayload.is_active;
        findUser[0].remember_token = loginPayload.remember_token;

        return response.status(200).json({
            success: true,
            statusCode: 200,
            message: 'Login successful',
            data: findUser
        });

    } catch (error) {
        console.log("Error at Try Catch API", error);
        return response.status(200).json({
            success: false,
            statusCode: 500,
            message: 'Error while user login',
            data: null
        });
    }
}

// sign in API with google and fb API via request params
module.exports.signInWithGoogleFb = async (request, response) => {

    console.log("request payload data issss", request.body);

    // const Payload = {
    //     id: null,
    //     name: request.body.name,
    //     email: request.body.email,
    //     password: request.body.password,
    //     mobile: request.body.mobile,
    //     role: request.body.role,
    //     points: request.body.points,
    //     status: request.body.status,
    //     token: null,
    //     provider: request.body.provider,
    //     image: request.body.profileUrl,
    //     login_time: moment().format('YYYY-MM-DD HH:mm:ss'),
    //     logout_time: null
    // }

    const findUser = await library.simpleselect(Users, '*', `email='${request.body.email}'`);

    console.log("Get user login response", findUser);

    if (!findUser || findUser.length == 0) {
        request.body['id'] = null;
    } else {
        request.body['id'] = findUser[0]['id'];
        request.body['points'] = findUser[0]['points'];
    }

    // user password encryption process
    const saltRounds = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(request.body.password, saltRounds);
    const encrytPassword = await library.encrypt(hashPassword, process.env.SECURITY_KEY);
    request.body.password = encrytPassword;

    console.log("Insert user payload issss", request.body);
    
    request.body.remember_token = request.body['remember_token'];

    await library.insertOrUpdate(request, Users, request.body).then(result => {
        console.log("Get response user signed in", result);

        request.body['id'] = result[0];

        const token = jwt.sign({
            email: request.body.email,
            password: request.body.password,
        }, process.env.SECURITY_KEY, {
            algorithm: 'HS256',
            expiresIn: '1hr'
        });

        request.body.remember_token = token;

        response.status(200).json({
            success: true,
            error: false,
            status: 200,
            message: 'SignIn successful.',
            data: [request.body]
        });
    }).catch(error => {
        console.log('Error while signin with email', error);
        response.status(200).json({
            success: false,
            error: true,
            status: 500,
            message: 'Failed to signin with email.',
            data: null
        });
    });
}

// user forgot password and reset password API
module.exports.forgotPassword = async (request, response) => {

    console.log("request body isss", request.body);

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD
        }
    });

    const findUser = await library.simpleselect(Users, '*', `email='${request.body.email}'`);

    console.log("Get response of update password", findUser);

    if (!findUser || findUser.length == 0) {
        console.log('Invalid email or email is not registered', findUser);
        return response.status(200).json({
            success: false,
            error: true,
            message: 'Invalid email or email is not registered',
            data: null
        });
    }

    const updatePassword = cryptoRandomString({
        length: 10,
        type: 'alphanumeric'
    });

    const mailOptions = {
        from: process.env.MAIL_USER,
        to: `${request.body.email}`,
        subject: 'Reset password request mail',
        // text: `Hi ${findUser[0].name}, I think you might forgot your password. No problem, Please login with new Password :: ${updatePassword}`,
        html: `<p>Hi ${findUser[0].name}, I think you might forgot your password. No problem, Please login with new Password :: ${updatePassword}</p>`
    }

    try {
        await transporter.sendMail(mailOptions, async function (err) {
            if (err) {
                console.log('Error while sent mail', err);
                return response.status(200).json({
                    success: false,
                    error: true,
                    message: 'Error while sent mail',
                    data: null
                });
            } else {
                // user password encryption process
                const saltRounds = bcrypt.genSaltSync(10);
                const hashPassword = bcrypt.hashSync(updatePassword, saltRounds);
                const encrytPassword = await library.encrypt(hashPassword, process.env.SECURITY_KEY);

                await library.updateWithWhere(request, Users, {
                    password: encrytPassword
                }, `email = '${request.body.email}'`).then(async result => {
                    console.log('New password sent to email successful', result);
                    return response.status(200).json({
                        success: true,
                        error: false,
                        message: 'New password sent to email successful',
                        data: result
                    });
                }).catch(err1 => {
                    console.log("Failed to update new password", err1);
                    return response.status(200).json({
                        success: false,
                        error: true,
                        message: 'Failed to update new password',
                        data: null
                    });
                });
            }
        });
    } catch (error) {
        console.log("Error at Try Catch API", error);
        return response.status(200).json({
            success: false,
            error: true,
            message: 'Error while sent mail',
            data: null
        });
    }
}

// user email verification via otp API
module.exports.emailVerifyOtp = async (request, response) => {

    console.log("request body isss", request.body);

    const findUser = await library.simpleselect(Users, '*', `email='${request.body.email}'`);

    console.log("Get user response", findUser);

    if (findUser.length !== 0) {
        return response.status(200).json({
            success: false,
            error: true,
            message: 'Email already exists, please login',
            data: null
        });
    }

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD
        }
    });

    const otpNumber = cryptoRandomString({
        length: 6,
        type: 'numeric'
    });

    console.log("otpNumber isss", otpNumber);

    const updateOtp = await library.insertOrUpdate(request, Otp_verification, {
        email: request.body.email,
        otp_code: otpNumber.toString(),
        status: 1
    });

    console.log("Get response of update otp", updateOtp);

    // var source = fs.readFileSync(__dirname + '/mail.html');

    // console.log(source);

    const mailOptions = {
        from: process.env.MAIL_USER,
        to: `${request.body.email}`,
        subject: 'Email verification request via OTP (One Time Password)',
        // text: `Hi ${request.body.username}, Please verify your email with otp code :: ${otpNumber}`,
        html: `<h3>OTP Mail - BACATA STORE</h3>
            <p>Hi <b>${request.body.username}</b>, Greetings From <b>Bacata Stores</b> App!</p>
            <br>
            <p>Please verify your email address with OTP Code : <span>${otpNumber}</span></p>`
    }

    try {
        await transporter.sendMail(mailOptions, async function (err, result) {
            if (err) {
                console.log('Error while sent otp to mail', err);
                return response.status(200).json({
                    success: false,
                    error: true,
                    message: 'Error while sent otp to mail',
                    data: null
                });
            } else {
                console.log('Otp sent to email successful', result, otpNumber);
                return response.status(200).json({
                    success: true,
                    error: false,
                    message: 'Otp sent to email successful',
                    data: otpNumber
                });
            }
        });
    } catch (error) {
        console.log("Error at Try Catch API", error);
        return response.status(200).json({
            success: false,
            error: true,
            message: 'Error while sent otp to mail',
            data: null
        });
    }
}

// user profile details update API
module.exports.updateProfileInformation = async (request, response) => {
    console.log("request body isss", request.body);

    await library.updateWithWhere(request, Users, {
        username: request.body.username
    }, `userid=${request.body.user_id}`).then(async result => {

        console.log('Get response of updateProfile', result);

        return response.status(200).json({
            success: true,
            statusCode: 200,
            message: 'Profile updated successful',
            data: result
        });
    }).catch(err => {
        console.log("Failed to update profile.", err);
        return response.status(200).json({
            success: false,
            statusCode: 500,
            message: 'Failed to update profile.',
            data: null
        });
    });
}

// user profile details update API
module.exports.updatePasswordInformation = async (request, response) => {
    console.log("request body isss", request.body);

    const findUser = await library.simpleselect(Users, '*', `userid=${request.body.user_id}`);

    console.log("Get user login response", findUser);

    if (!findUser || findUser.length == 0) {
        return response.status(200).json({
            success: false,
            statusCode: 404,
            message: 'Invalid user or user not registered',
            data: null
        });
    }

    // user password decryption process
    const decryptPassword = await library.decrypt(findUser[0].password, process.env.SECURITY_KEY);

    bcrypt.compare(request.body.current_password, decryptPassword, async (error, status) => {

        if (error) {
            console.log("Error while comparing password", error);
            return response.status(200).json({
                success: false,
                statusCode: 500,
                message: `Error while comparing password`,
                data: null
            });
        }

        console.log(status);

        if (!status) {
            return response.status(200).json({
                success: false,
                statusCode: 404,
                message: `Current password is not correct`,
                data: null
            });
        } else {
            const saltRounds = bcrypt.genSaltSync(10);
            const hashPassword = bcrypt.hashSync(request.body.new_password, saltRounds);
            const encrytPassword = await library.encrypt(hashPassword, process.env.SECURITY_KEY);
            request.body.new_password = encrytPassword;

            await library.updateWithWhere(request, Users, {
                password: request.body.new_password
            }, `userid=${request.body.user_id}`).then(async result => {

                console.log('Get response of updatePassword', result);

                return response.status(200).json({
                    success: true,
                    statusCode: 200,
                    message: 'New password updated successful',
                    data: result
                });
            }).catch(err => {
                console.log("Failed to update new password.", err);
                return response.status(200).json({
                    success: false,
                    statusCode: 500,
                    message: 'Failed to update new password.',
                    data: null
                });
            });
        }
    });
}

// user Logout API
module.exports.userLogout = async (request, response) => {

    console.log("request payload issss", request.body);

    request.body.id = Number(request.body.id);

    await library.insertOrUpdate(request, Users, request.body).then(async result => {
        return response.status(200).json({
            success: true,
            error: false,
            message: 'User logout successful',
            data: result
        });
    }).catch(err => {
        return response.status(200).json({
            success: false,
            error: true,
            message: 'Failed to logout a user',
            data: null
        });
    });
}

// admin Login API
module.exports.adminLogin = async (request, response) => {
    console.log('request body iss', request.body);

    if (!request.body.email || !request.body.password) {
        return response.status(200).json({
            message: 'Invalid email and password'
        })
    }

    await library.simpleselect(Users, '*', `email='${request.body.email}' AND password='${request.body.password}'`).then(async result => {

        console.log("Get admin login response", result);
        
        if (!result || result.length == 0) {
            return response.status(200).json({
                success: false,
                error: true,
                message: 'Invalid email or email not registered',
                data: null
            });
        }

        const token = jwt.sign({
            email: result[0].email,
            password: result[0].password,
        }, process.env.SECURITY_KEY, {
            algorithm: 'HS256',
            expiresIn: '1hr'
        });

        // Insert Logged In Users (Login_time, Is_active, Remember_token)
        const loginPayload = {
            id: result[0].id,
            login_time: moment().format('YYYY-MM-DD HH:mm:ss'),
            is_active: 1,
            remember_token: token
        }

        console.log('Admin login payload', loginPayload);

        await library.insertOrUpdate(request, Users, loginPayload).catch(err0 => {
            console.log("Error while updating admin data", err0);
            return response.status(200).json({
                success: false,
                error: true,
                message: 'Login failed',
                data: null
            });
        });

        result[0].login_time = loginPayload.login_time;
        result[0].is_active = loginPayload.is_active;
        result[0].remember_token = loginPayload.remember_token;

        return response.status(200).json({
            success: true,
            statusCode: 200,
            message: 'Login successful',
            data: result
        });
    }).catch(err1 => {
        console.log("Error while admin login", err1);
        return response.status(200).json({
            success: false,
            error: true,
            message: 'Login failed',
            data: null
        });
    });
}

// admin Logout API
module.exports.adminLogout = async (request, response) => {

    console.log("request payload issss", request.body);

    request.body.id = Number(request.body.id);

    await library.insertOrUpdate(request, Users, request.body).then(async result => {
        return response.status(200).json({
            success: true,
            error: false,
            message: 'Admin logout successful',
            data: result
        });
    }).catch(err => {
        return response.status(200).json({
            success: false,
            error: true,
            message: 'Failed to logout a admin',
            data: null
        });
    });
}
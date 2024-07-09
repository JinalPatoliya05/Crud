const sendSuccess = async (res, req) => {
    const responseData = {
        status: req.status,
        message: req.message,
        data: req.data,
        count: req.count,
        totalPages: req.totalPages,
    };
    res.status(200).send(responseData);
};

const sendAuthError = async (res, req) => {
    res.status(401).send(req.error);
};

const sendError = async (res, error) => {
    let msg;
    if (error.message?.original?.errno === 1062) {
        msg = error.message.errors[0].message;
    } else {
        msg = error.message;
    }
    res.status(422).send({ message: msg });
};

const sendValidationError = async (res, error) => {
    let transformed = {};
    if (error) {
        Object.keys(error).forEach(function (key) {
            transformed[key] = error[key][0];
        });
    }
    res.status(422).send({ status: false, error: transformed });
};

module.exports = { sendSuccess, sendError, sendAuthError, sendValidationError };

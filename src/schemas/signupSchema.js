import joi from "joi";

const signupSchema = joi.object({
	email: joi.string().email().required(),
	password: joi.string().required(),
	username: joi.string().required(),
	url: joi
		.string()
		.pattern(
			/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
		)
		.required(),
});

export default signupSchema;

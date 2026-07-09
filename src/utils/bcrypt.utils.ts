import bcrypt from "bcryptjs";

//hash password
export const hashPassword = async (password: string) => {

    try {
        const salt = await bcrypt.genSalt(10);
        console.log(salt);
        return await bcrypt.hash(password, salt);

    } catch (error) {
        console.log(error);
        throw new Error("Something went wrong");
    }
};

//compare password
export const comparePassword = async (password: string, hash: string) => {
    try {
        return await bcrypt.compare(password, hash);
    } catch (error) {
        console.log(error);
        throw new Error("Something went wrong");
    }
};
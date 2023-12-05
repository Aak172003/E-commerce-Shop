
// Hash krne ke lie bcryt

import bcrypt from 'bcrypt';

export const hasPassword = async (password) => {

    try {

        // cpu efficiency increases as per increase salt Rounds
        const saltRound = 5;

        const hashedPassword = await bcrypt.hash(password, saltRound);
        return hashedPassword;
    }

    catch (error) {
        console.log(error)
    }
}

// Compare krke decrypt

export const comparePassword = async (password, hashedPassword) => {

    // this return true or false 
    return bcrypt.compare(password, hashedPassword);
}
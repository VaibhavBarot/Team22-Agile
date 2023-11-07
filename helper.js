
const checkName =async (name, fieldName) =>{
    if (!name) throw `${fieldName} cannot be empty`;
    if (typeof name !== 'string') throw `${fieldName} must be a string`;
    name=name.trim()
    if (name.length === 0) throw `${fieldName} cannot be an empty string or string with just spaces`;
    if (!(/^[A-Za-z]{3,}$/).test(name)) throw `Invalid ${fieldName}`;
    return name;
};

module.exports = {
    checkName
}

const checkName = async (name, fieldName) => {
    if (!name || typeof name !== 'string' || name.trim() === '') {
      throw new Error(`${fieldName} must be a non-empty string`);
    }
    if (!(/^[A-Za-z]{3,}$/).test(name)) throw new Error (`Invalid ${fieldName}`);

    return true;
  };



module.exports = {
    checkName
}
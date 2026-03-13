const convertToDate = (dateStr) => {
    if (!dateStr) return new Date(0);
    const [day, month, year] = dateStr.split('-');
    return new Date(`${year}-${month}-${day}`);
};

export default convertToDate;

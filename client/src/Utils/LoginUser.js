const logedInUser = ()=>{return JSON.parse(localStorage.getItem("user"));}

export default logedInUser;
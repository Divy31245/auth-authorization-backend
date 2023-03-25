export const allAccess = (req,res) =>{
    res.status(200).send("all content");
}
export const userBoard = (req,res) =>{
    res.status(200).send("user content");
}
export const modBoard = (req,res) =>{
    res.status(200).send("mod content");
}
export const adminBoard = (req,res) =>{
    res.status(200).send("admin content");
}
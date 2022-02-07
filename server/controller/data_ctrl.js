const {getFileById, getAll, getListFile, getFileData} =  require("../helper/file_helper");

exports.getOneFile = async (req, res) => {
  const file = await getFileById(req.params.fileId);
  console.log(file)
  res.send(file)
}

exports.getAllFile = async (req, res) => {
  /*
  const allFile = await getAll()
  res.send(allFile);*/
  //const listFile = await getListFile(["61fd1d3c1b3b249e708cf951", "61fd1e9a87ed620e4d3a967a"])
  //res.send(listFile)
  const fileData = await getFileData("61fd68164780262119a21826");
  /*console.log(fileData.data)
  var fileBuffer = Buffer.from(fileData.data);
  var file = fileBuffer.toString('base64');*/

  res.send(fileData.data.value().toString("base64"))
  
}

exports.upLoadFile = (req, res, next) => {
    console.log(req.body);
    console.log(req.file);

  res.send("Xong")
}

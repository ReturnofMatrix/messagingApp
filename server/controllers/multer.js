const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb)=> {
        cb(null,path.join(__dirname,'..', 'uploads'));
    },
    filename: (req, file, cb)=>{
        const ext = path.extname(file.originalname);
        const uniqueName = `${Date.now()}_${ext}`;
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image/')){
        cb(null, true);
    }else{
        cb(new Error('only image files allowed.'), false);
    }
} 

const upload = multer({storage, fileFilter});

module.exports = upload;
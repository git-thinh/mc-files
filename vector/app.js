const __ROOT_FILES = __dirname + '/files/';
const fs = require('fs')
const path = require('path')
if (!fs.existsSync(__ROOT_FILES)) fs.mkdirSync(__ROOT_FILES);

const express = require('express')
const app = express();

const cors = require('cors');
app.use(cors({
	origin: '*'
}));

const bodyParser = require('body-parser');
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({
	extended: true
})) // for parsing application/x-www-form-urlencoded

const multer = require('multer');
const upload = multer({
	dest: __ROOT_FILES
});
/////////////////////////////////////////////////////////

const gs = require('ghostscript-js')
const sizeOf = require('image-size')

function gsCall(id, file, cb) {
	let filePng = `${__ROOT_FILES}/${id}.png`;
	gs.exec([
		'-q',
		'-dNOPAUSE',
		'-dBATCH',
		'-dQUIET',
		///////////////////////////
		'-sDEVICE=pngalpha', // jpeg, pngalpha, png16m
		'-dTextAlphaBits=4', // font antialiasing
		///////////////////////////
		'-r72', // dpi
		///////////////////////////
		`-sOutputFile="${filePng}"`,
		`${file}`
	], (codeError) => cb(codeError));
}

function pdfToPngCallback(id, name, file, cb) {
	let v = {
		ok: false,
		id: id,
		name: name,
		width: 0,
		height: 0,
		message: '',
		ImageBase64: '',
	};
	let filePng = `${__ROOT_FILES}/${id}.png`;
	gsCall(id, file, (codeError) => {
		if (codeError) {
			// deal with the codeError
			v.message = codeError;
			cb(v);
			return;
		}
		// Great ! No errors !						
		try {
			const dimensions = sizeOf(filePng);
			v.width = dimensions.width;
			v.height = dimensions.height;

			v.ok = true;
			v.ImageBase64 = fs.readFileSync(filePng, 'base64');
			cb(v);
		} catch (errSize) {
			v.message = 'ERROR_SIZE: ' + errSize.message;
			cb(v);
		}
	})
}

/////////////////////////////////////////////////////////

app.post('/api/vector/to-png', upload.single('file'), function(req, res) {
	//const title = req.body.title;
	//console.log(title);
	const file = req.file;
	//console.log(file);
	pdfToPngCallback(file.filename, file.originalname, file.path, (v) => {
		res.json(v);
	})
});
app.get('/:id.png', async (req, res) => {
	let file = `${__ROOT_FILES}/${req.params.id}.png`
	if (fs.existsSync(file)) {
		//console.log('file =', file);
		res.setHeader("Content-Type", "image/png");
		return res.sendFile(file);
	}
	res.end();
});
app.get('/', async (req, res) => res.end('OK'));

app.listen(38686, () => {
	console.log('http:*:38686/api/vector/to-png')
})
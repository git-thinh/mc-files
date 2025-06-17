/*
import getFormData from './lambda-multipart-parser/index.cjs';

const fd = await getFormData(event);

    {
        files: [
            {
                filename: 'test.pdf',
                content: <Buffer 25 50 6f 62 ... >,
                contentType: 'application/pdf',
                encoding: '7bit',
                fieldname: 'uploadFile1'
            }
        ],
        field1: 'VALUE1',
        field2: 'VALUE2',
    }

*/

import parser from './parser.cjs';

export default async function (event) {
    const formData = await parser.parse(event);
    return formData || {};
}
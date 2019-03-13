import * as fs from 'fs';
import * as path from 'path';

const makeFilesTree = (dir: string, files: {[name: string]: string}) => {
    Object.keys(files).forEach((name) => {
        const filePath = path.join(dir, name);
        const dirname = path.dirname(filePath);
        if(!fs.existsSync(dirname)) {
            fs.mkdirSync(dirname);
        }
        fs.writeFileSync(filePath, files[name]);
      });
};

export default makeFilesTree;
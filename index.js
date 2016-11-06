exports.MesLuaDoc = function(luaProjectPath) {
    luaProjectPath = luaProjectPath.trim();
    luaProjectPath = luaProjectPath.replace(/\/$/, "");

    const fs = require('fs');
    const path = require('path');
    let listFiles = [];
    let docsDirectory = luaProjectPath + '/docs';

    //  Удалить папку с документацией
    if (fs.existsSync(docsDirectory)) {
        deleteFolderRecursive(docsDirectory);
    }

    fs.mkdirSync(docsDirectory);

    let stylesPath = `./styles.css`;
    let styles;

    if (fs.existsSync(stylesPath)) {
        styles = fs.readFileSync(stylesPath, 'UTF-8');
    } else {
        styles = fs.readFileSync(`./node_modules/mes-luadoc/styles.css`, 'UTF-8');
    }

    let htmlTopCode = `
<html>
    <head>
        <meta charset="utf-8">
        <style>
            ${styles}
        </style>
       </head>
    <body>
        <div class="documentationWrap">
    `;
    let htmlBottomCode = `
    </body>
</html>
    `;

    fs.appendFile(docsDirectory + '/index.html', htmlTopCode);

    readDirectory(luaProjectPath, writeDoc);

    function readDirectory(directoryPath, handle) {
        fs.readdir(directoryPath, (errors, files) => {
            files.forEach(file => {
                let objPath = directoryPath+ '/' +file;

                //  Проверим, это файл или директория
                //
                //  Файл с раширением .lua - добавим в очередь обработки
                let fileStat = fs.lstatSync(objPath);

                if (fileStat.isFile()) {
                    if (path.extname(objPath) == '.lua') {
                        listFiles.push(objPath);

                        handle(objPath);
                    }
                }

                //  Если это директория, ищем в ней .lua файлы
                if (fileStat.isDirectory()) {
                    readDirectory(objPath, handle);
                }
            });
        });
    }

    function writeDoc(filePath) {
        let comments = '';
        let commentHtml = `<div class="file">`;
        commentHtml += `
            <div class="fileTitle">
                <div>${filePath}</div>
            </div>`;
        commentHtml += `<div class="contentList">`;
        let fileContent = fs.readFileSync(filePath, 'UTF-8');
        let fileComments = fileContent.match(/--\[=====\[(.|[\s\S])*?--\]=====\]/g);

        if (fileComments != null) {
            fileComments.forEach(comment => {
                let type = comment.match(/@type (.*)/g);

                //  Имя функции/переменной
                let name = comment.match(/@name (.*)/g);

                if (name != null) {
                    name = name[0];
                    name = name.replace(/@name/, '');
                    name = name.trim();
                }

                //  Краткое описание
                let brief = comment.match(/@brief (.*)/g);

                if (brief != null) {
                    brief = brief[0];
                    brief = brief.replace(/@brief/, '');
                    brief = brief.trim();
                }

                //  Параметры
                let params = comment.match(/@param (.*)/g);
                let paramsHtml = '';

                if (params != null) {
                    params.forEach(param => {
                        param = param.replace(/@param/, '');
                        param = param.trim();
                        let paramName = param.match(/([^\s]+)/i);
                        paramName = paramName[0].trim();
                        let paramDesc = param.match(/\s(.*)/i);
                        paramDesc = paramDesc[0].trim();

                        paramsHtml += `
                            <div class="item">
                                <div class="name">
                                    ${paramName}
                                </div>
                                <div class="description">
                                    ${paramDesc}
                                </div>
                            </div>`;
                    });
                }

                commentHtml += `<div class="item">
                    <div class="top">
                        <div class="name">${name}</div>
                        <div class="brief">${brief}</div>
                    </div>
                    <div class="params">
                        ${paramsHtml}
                    </div>
                </div>`;

                console.log(name);
            })
        }

        commentHtml += '</div></div>';

        fs.appendFile(docsDirectory + '/index.html', commentHtml);
    }

    function deleteFolderRecursive(path) {
        if( fs.existsSync(path) ) {
            fs.readdirSync(path).forEach(function(file,index){
                var curPath = path + "/" + file;
                if(fs.lstatSync(curPath).isDirectory()) { // recurse
                    deleteFolderRecursive(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
    };
}
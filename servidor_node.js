"use strict";
const express = require('express');
const app = express();
app.set('puerto', 9876);
app.get('/', (request, response) => {
    response.send('GET - servidor NodeJS');
});
const fs = require('fs');
app.use(express.json());
const path_archivo = "./archivos/productos.txt";
const path_archivo_foto = "./archivos/productos_fotos.txt";
const multer = require('multer');
const mime = require('mime-types');
const storage = multer.diskStorage({
    destination: "public/fotos/",
});
const upload = multer({
    storage: storage
});
app.get('/productos', (request, response) => {
    fs.readFile(path_archivo, "UTF-8", (err, archivo) => {
        if (err)
            throw ("Error al intentar leer el archivo.");
        console.log("Archivo leído.");
        let prod_array = archivo.split(",\r\n");
        response.send(JSON.stringify(prod_array));
    });
});
app.post('/productos', (request, response) => {
    let dato = request.body;
    let contenido = JSON.stringify(dato) + ",\r\n";
    fs.appendFile(path_archivo, contenido, (err) => {
        if (err)
            throw ("Error al intentar agregar en archivo.");
        console.log("Archivo escrito.");
        response.send("Archivo producto escrito.");
    });
});
app.post('/productos/modificar', (request, response) => {
    let obj = request.body;
    fs.readFile(path_archivo, "UTF-8", (err, archivo) => {
        if (err)
            throw ("Error al intentar leer el archivo.");
        let prod_array = archivo.split(",\r\n");
        let obj_array = [];
        prod_array.forEach((prod_str) => {
            if (prod_str != "" && prod_str != undefined) {
                obj_array.push(JSON.parse(prod_str));
            }
        });
        let obj_array_modif = [];
        obj_array.forEach((prod) => {
            if (prod.codigo == obj.codigo) {
                prod.marca = obj.marca;
                prod.precio = obj.precio;
            }
            obj_array_modif.push(prod);
        });
        let productos_string = "";
        obj_array_modif.forEach((prod) => {
            productos_string += JSON.stringify(prod) + ",\r\n";
        });
        fs.writeFile(path_archivo, productos_string, (err) => {
            if (err)
                throw ("Error al intentar escribir en archivo.");
            console.log("Archivo modificado.");
            response.send("Archivo producto modificado.");
        });
    });
});
app.post('/productos/eliminar', (request, response) => {
    let obj = request.body;
    fs.readFile(path_archivo, "UTF-8", (err, archivo) => {
        if (err)
            throw ("Error al intentar leer el archivo.");
        let prod_array = archivo.split(",\r\n");
        let obj_array = [];
        prod_array.forEach((prod_str) => {
            if (prod_str != "" && prod_str != undefined) {
                obj_array.push(JSON.parse(prod_str));
            }
        });
        let obj_array_eli = [];
        obj_array.forEach((prod) => {
            if (prod.codigo != obj.codigo) {
                obj_array_eli.push(prod);
            }
        });
        let productos_string = "";
        obj_array_eli.forEach((prod) => {
            productos_string += JSON.stringify(prod) + ",\r\n";
        });
        fs.writeFile(path_archivo, productos_string, (err) => {
            if (err)
                throw ("Error al intentar escribir en archivo.");
            console.log("Archivo eliminado.");
            response.send("Archivo producto eliminado.");
        });
    });
});
app.get('/productos_fotos', (request, response) => {
    fs.readFile(path_archivo_foto, "UTF-8", (err, archivo) => {
        if (err)
            throw ("Error al intentar leer el archivo con foto.");
        console.log("Archivo leído con foto.");
        let prod_array = archivo.split(",\r\n");
        response.send(JSON.stringify(prod_array));
    });
});
app.post('/productos_fotos', upload.single("foto"), (request, response) => {
    let file = request.file;
    let extension = mime.extension(file.mimetype);
    let obj = JSON.parse(request.body.obj);
    let path = file.destination + obj.codigo + "." + extension;
    fs.renameSync(file.path, path);
    obj.path = path.split("public/")[1];
    let contenido = JSON.stringify(obj) + ",\r\n";
    fs.appendFile(path_archivo_foto, contenido, (err) => {
        if (err)
            throw ("Error al intentar agregar en archivo con foto.");
        console.log("Archivo escrito con foto.");
        response.send("Archivo producto escrito - con foto.");
    });
});
app.post('/productos_fotos/modificar', upload.single("foto"), (request, response) => {
    let file = request.file;
    let extension = mime.extension(file.mimetype);
    let obj = JSON.parse(request.body.obj);
    let path = file.destination + obj.codigo + "." + extension;
    fs.renameSync(file.path, path);
    obj.path = path.split("public/")[1];
    fs.readFile(path_archivo_foto, "UTF-8", (err, archivo) => {
        if (err)
            throw ("Error al intentar leer el archivo con foto.");
        let prod_array = archivo.split(",\r\n");
        let obj_array = [];
        prod_array.forEach((prod_str) => {
            if (prod_str != "" && prod_str != undefined) {
                obj_array.push(JSON.parse(prod_str));
            }
        });
        let obj_array_modif = [];
        obj_array.forEach((prod) => {
            if (prod.codigo == obj.codigo) {
                prod.marca = obj.marca;
                prod.precio = obj.precio;
            }
            obj_array_modif.push(prod);
        });
        let productos_string = "";
        obj_array_modif.forEach((prod) => {
            productos_string += JSON.stringify(prod) + ",\r\n";
        });
        fs.writeFile(path_archivo_foto, productos_string, (err) => {
            if (err)
                throw ("Error al intentar escribir en archivo.");
            console.log("Archivo modificado con foto.");
            response.send("Archivo producto modificado con foto.");
        });
    });
});
app.post('/productos_fotos/eliminar', (request, response) => {
    let obj = request.body;
    fs.readFile(path_archivo_foto, "UTF-8", (err, archivo) => {
        if (err)
            throw ("Error al intentar leer el archivo con foto.");
        let prod_array = archivo.split(",\r\n");
        let obj_array = [];
        prod_array.forEach((prod_str) => {
            if (prod_str != "" && prod_str != undefined) {
                obj_array.push(JSON.parse(prod_str));
            }
        });
        let obj_array_eli = [];
        let path_foto = "public/";
        obj_array.forEach((prod) => {
            if (prod.codigo != obj.codigo) {
                obj_array_eli.push(prod);
            }
            else {
                path_foto += prod.path;
            }
        });
        let productos_string = "";
        if (path_foto !== "") {
            obj_array_eli.forEach((prod) => {
                productos_string += JSON.stringify(prod) + ",\r\n";
            });
            fs.writeFile(path_archivo_foto, productos_string, (err) => {
                if (err)
                    throw ("Error al intentar escribir en archivo con foto.");
                console.log("Archivo eliminado con foto.");
                fs.unlink(path_foto, (err) => {
                    if (err)
                        throw err;
                    console.log(path_foto + ' fue borrado.');
                });
                response.send("Archivo producto con foto eliminado.");
            });
        }
    });
});
app.post('/test_fotos_multiples', upload.array("fotos"), (request, response) => {
    console.log(request.files);
    let files = request.files;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        let extension = mime.extension(file.mimetype);
        let path = file.destination + "__foto__" + i + "." + extension;
        fs.renameSync(file.path, path);
    }
    response.send("Archivos múltiples subidos exitosamente!!!");
});
app.listen(app.get('puerto'), () => {
    console.log('Servidor corriendo sobre puerto:', app.get('puerto'));
});
//# sourceMappingURL=servidor_node.js.map
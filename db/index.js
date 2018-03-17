var Sequelize = require("sequelize");

const sequelize = new Sequelize("mydb", "postgres", "fle123",{
    dialect: "postgres",
    port : 5432,
    host: "127.0.0.1",
    operatorsAliases: false
});

const Student = sequelize.define("student", {
    name: Sequelize.STRING,
    birthday: Sequelize.DATE
});

exports.addStudent = function (name,birthday) {
    return new Promise((resolve, reject) => {
        sequelize.sync()
            .then(() => {
                Student.create({
                    name: name,
                    birthday: birthday
                })
                    .then(student => {
                        console.log("Добавление произошло успешно");
                        if (student){
                            resolve([student]);
                        }
                        reject([]);
                    })
                    .catch(() => {
                        console.log("Ошибочка");
                        reject([]);
                    });
            })
    });
};

exports.getStudents = function () {
    return new Promise((resolve, reject) => {
        sequelize.sync()
            .then(() => {
                Student.findAll().then(students => {
                    if (students){
                        resolve(students);
                    }
                    reject([]);
                })
            })
            .catch(() => {
                reject([]);
            })
    });
};

exports.deleteStudent= function (index) {
    return new Promise((resolve, reject) => {
        sequelize.sync()
            .then(() => {
                Student.destroy({
                    where: {
                        id: index
                    }
                })
                    .then(students => {
                        console.log("Удаление произошло успешно");
                        if (students){
                            resolve([]);
                        }
                        reject([]);
                    })
                    .catch(() => {
                        console.log("Ошибочка");
                        reject([]);
                    });
            })
    });
};

exports.changeStudent= function (index,name,birthday) {
    return new Promise((resolve, reject) => {
        sequelize.sync()
            .then(() => {Student.find({
                where: {
                    id: index
                }

            })
            .then((student) => {
                student.updateAttributes({
                    name: name,
                    birthday: birthday
                })
                .then(students => {
                    console.log("Изменение произошло успешно!");
                    if (students){
                        resolve([]);
                }
                    reject([]);
                })
                .catch(() => {
                    console.log("Ошибочка");
                    reject([]);
                });
            })

        })
    });
};

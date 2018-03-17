sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/commons/MessageBox",
	"sap/m/MessageToast"
], function(Controller, JSONModel, Filter, FilterOperator, MessageToast) {
	'use strict';

	return Controller.extend('sample.app.controller.App', {

		onInit: function() {
			var view = this.getView();


            console.log("Init successfully");
			$.get("/students")
				.done(function(data) {
					console.log(data);
					var model = new JSONModel();
					model.setProperty("/students", data);
					view.setModel(model);
				})
		},

        createDialog: function () {
            var oModel = new sap.ui.model.json.JSONModel();
            const view = this.getView();
            var data = {
                Text: "Добавление студента",
                name: "",
                birthday: "",
            };
            oModel.setData(data);
            var oDialog = view.byId("createDialog");
            if (!oDialog) {
                oDialog = sap.ui.xmlfragment(view.getId(), "sample.app.view.createDialog",this);
                view.addDependent(oDialog);
            }
            oDialog.setModel(oModel);
            oDialog.open();
        },

        createFunction: function () {
            const view = this.getView();
            var DialogData=view.byId("createDialog").getModel().getData();
            $.post("/students/"+"?name="+DialogData.name+"&birthday="+DialogData.birthday)
                .done(function(data) {
                    if(data.state==="ok")
                    {
                        MessageToast.show("Студент добавлен!");
                        view.byId("createDialog").close();
                        const oModel=view.getModel();
                        var oData = oModel.getProperty('/students');
                        //alert(JSON.stringify(data.student));
                        oData.push(data.student);
                        oModel.setProperty("/students",oData);
                        var oTable = view.byId('otable');
                        var VisibleRows=parseInt(oTable.getProperty('visibleRowCount'))+1;
                        oTable.setProperty('visibleRowCount',VisibleRows);
                    }
                    else
                    {
                        MessageToast.show("Произошла ошибка при добавлении! Возможно вы 'Случайно' ввели неверные данные");
                    }
                });
        },

        changeDialog: function (oEvent) {
            var view = this.getView();
            var oModel = new sap.ui.model.json.JSONModel();
            var Index = oEvent.getSource().getParent().getParent().getIndex();
            var curStudent=view.getModel().getProperty('/students')[Index];
            var data = {
                Index:Index,
                id: curStudent.id,
                Text: "Изменение студента",
                name: curStudent.name,
                birthday: curStudent.birthday,
            };
            oModel.setData(data);
            var oDialog = view.byId("changeDialog");
            if (!oDialog) {
                oDialog = sap.ui.xmlfragment(view.getId(), "sample.app.view.changeDialog",this);
                view.addDependent(oDialog);
            }
            oDialog.setModel(oModel);
            oDialog.open();
        },

        changeFunction: function () {
            var ModelProp=this.getView().byId("changeDialog").getModel().getData();
            const view = this.getView();
            $.post("/students/"+ModelProp.id+"?name="+ModelProp.name+"&birthday="+ModelProp.birthday)
                .done(function(data) {
                    if(data.state==="ok")
                        {
                            MessageToast.show("Данные студента изменены!");
                            view.byId("changeDialog").close();
                            const oModel=view.getModel();
                            var oData = oModel.getProperty('/students');
                            oData[parseInt(ModelProp.Index)].name=ModelProp.name;
                            oData[parseInt(ModelProp.Index)].birthday=ModelProp.birthday;
                            oModel.setProperty("/students",oData);
                        }
                        else
                        {
                            MessageToast.show("Произошла ошибка при изменении! Возможно вы 'Случайно' ввели неверные данные");
                        }
                });
        },

        onCloseDialog : function () {
            this.getView().byId("createDialog").close();
            this.getView().byId("changeDialog").close();
        },

        delete: function (oEvent) {
            var view = this.getView();
            var Index = oEvent.getSource().getParent().getParent().getIndex();
            var selectedObjId = view.getModel().getProperty('/students')[Index].id;
            var question=false;
            sap.ui.commons.MessageBox.confirm("Вы действительно хотите удалить этого студента?", fnCallbackConfirm, "Ведь его заберут в армию");
            function fnCallbackConfirm(bResult) {
                if(bResult===true)
                {
                    $.post("/students/del/"+selectedObjId)
                        .done(function(data) {
                            if(data.state==="ok")
                            {
                                MessageToast.show("Студент удален! Вы можете найти его в запасной базе, которой нет");
                                var oModel=view.getModel();
                                var oData = oModel.getProperty('/students');
                                oData.splice(Index,1);
                                oModel.setProperty("/students",oData);
                                var oTable = view.byId('otable');
                                var VisibleRows=parseInt(oTable.getProperty('visibleRowCount'))-1;
                                oTable.setProperty('visibleRowCount',VisibleRows)
                            }
                            else
                            {
                                MessageToast.show("Произошла ошибка при удалении!");
                            }
                        });
                }
            }
        },
        countFormatter: function(students) {
			return students.length;
		}

	});

});

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    'sap/m/Button',
    'sap/m/Dialog',
    'sap/m/Text',
    'sap/m/VBox'
], function (Controller, JSONModel, Fragment, Button, Dialog, Text, VBox) {
    'use strict';

    return Controller.extend("anders.aif.if.overview.controller.App", {
        onInit: function () {
            this.uname = this.getView().byId("UNAME");
            this.dtfrom = this.getView().byId("DTFROM");
            this.dtto = this.getView().byId("DTTO");

            this.oModelIFSTA = this.getOwnerComponent().getModel('ifsta');
            this.aFragID = new Array();
            this.aModelID = new Array();
            this.aHBox = new Array();
        },

        onExit: function () {

        },
        onGetSta: function () {

            for (let fid of this.aFragID) {
                //this.byId(fid).destroy(true);
                //  this.getView().removeDependent(this[`${fid}`]);
                this[`${fid}`].destroy(true);

            }

            for (let mid of this.aModelID) {
                //this.byId(fid).destroy(true);
                //  this.getView().removeDependent(this[`${fid}`]);
                this[`${mid}`].destroy(true);

            }

            for (let hboxid of this.aHBox) {
                this[`${hboxid}`].destroy(true);
            }
            this.byId("IFCount").setVisible(false);
            let pathTmp = "(uname='%uname%',datetime_from=datetimeoffset'%dtfrom%',datetime_to=datetimeoffset'%dtto%')";
            let uname = this.uname.getValue();
            let dtform = this.dtfrom.getDateValue().toISOString();
            let dtto = this.dtto.getDateValue().toISOString();

            let dtfromtmp = "datetimeoffset'%dtfrom%'";
            let dttotmp = "datetimeoffset'%dtto%'";

            pathTmp = pathTmp.replace("%uname%", uname);
            pathTmp = pathTmp.replace("%dtfrom%", dtform);
            pathTmp = pathTmp.replace("%dtto%", dtto);

            dtfromtmp = dtfromtmp.replace("%dtfrom%", dtform);
            dttotmp = dttotmp.replace("%dtto%", dtto);

            pathTmp = encodeURIComponent(pathTmp);
            let pathReq = "/MsgSta" + pathTmp + "/Set?$orderby=ns,ifname,ifver&$format=json&$inlinecount=allpages";
            let bindPath = "/MsgSta" + pathTmp + "/Set";
            //			let pathReq = "/ZAND_IF_OVERVIEW" + pathTmp + "/Set?$orderby=ns,ifname,ifver&$format=json&$inlinecount=allpages";
            //			let bindPath = "/ZAND_IF_OVERVIEW" + pathTmp + "/Set";
            let outthis = this;
            this.oModelIFSTA.read(pathReq, {
                method: "GET",
                sorters: [
                    new sap.ui.model.Sorter("ns"),
                    new sap.ui.model.Sorter("ifname"),
                    new sap.ui.model.Sorter("ifver")
                ],
                success: function (data) {

                    let sTitle = "Interace Statics";
                    let iCount = data.results.length;
                    sTitle += "(" + iCount + ")";
                    outthis.byId("IFCount").setText(sTitle);
                    outthis.byId("IFCount").setVisible(true);

                    let sItemTitle = "";
                    let sItemText = "";
                    let sItemState = "";
                    let sNowHboxID = "";
                    data.results.forEach(function (ifsta, i) {
                        outthis.aFragID = [];
                        outthis.aModelID = [];
                        outthis.aHBox = [];
                        let oIFStaticItem = {};

                        oIFStaticItem.title = `${ifsta.ns} - ${ifsta.ifname} - ${ifsta.ifver}`;
                        oIFStaticItem.subtitle = `${ifsta.ns_Text}`;
                        oIFStaticItem.statusText = `Messages:${ifsta.count_all}`;
                        oIFStaticItem.items = [];
                        if (ifsta.count_e > 0) {
                            sItemTitle = 'Error';
                            sItemText = `${ifsta.count_e}`;
                            sItemState = 'Error';
                            oIFStaticItem.items.push({ "title": sItemTitle, "text": sItemText, "state": sItemState });
                        }
                        if (ifsta.count_s > 0) {
                            sItemTitle = 'Success';
                            sItemText = `${ifsta.count_s}`;
                            sItemState = 'Success';
                            oIFStaticItem.items.push({ "title": sItemTitle, "text": sItemText, "state": sItemState });
                        }
                        if (ifsta.count_i > 0) {
                            sItemTitle = 'In Process';
                            sItemText = `${ifsta.count_i}`;
                            sItemState = 'Warning';
                            oIFStaticItem.items.push({ "title": sItemTitle, "text": sItemText, "state": sItemState });
                        }
                        if (ifsta.count_w > 0) {
                            sItemTitle = 'Warning';
                            sItemText = `${ifsta.count_w}`;
                            sItemState = 'Warning';
                            oIFStaticItem.items.push({ "title": sItemTitle, "text": sItemText, "state": sItemState });
                        }
                        if (ifsta.count_c > 0) {
                            sItemTitle = 'Canceled';
                            sItemText = `${ifsta.count_c}`;
                            sItemState = 'Information';
                            oIFStaticItem.items.push({ "title": sItemTitle, "text": sItemText, "state": sItemState });
                        }
                        if (ifsta.count_a > 0) {
                            sItemTitle = 'Technical Error';
                            sItemText = `${ifsta.count_a}`;
                            sItemState = 'Error';
                            oIFStaticItem.items.push({ "title": sItemTitle, "text": sItemText, "state": sItemState });
                        }
                        let oFragModel = new sap.ui.model.json.JSONModel();
                        oFragModel.setProperty("/IFStaticItem", oIFStaticItem);
                        let sModelID = `myFragModel${i}`;
                        outthis[`${sModelID}`] = oFragModel;
                       // outthis.aModelID.push(sModelID);



                        if ((i % 3) == 0) {
                            let sHboxID = `myHBox${i}`;
                            let hbox = new sap.m.HBox(sHboxID, { "fitContainer": true });
                            let oContainer = outthis.byId("addContent");
                            oContainer.addItem(hbox);

                            outthis.nowHBoxName = `${sHboxID}`;
                            outthis[`${outthis.nowHBoxName}`] = hbox;
                            sNowHboxID = sHboxID;
                           // outthis.aHBox.push(sHboxID);
                        }

                        let sFragID = `myFrag${i}`;
                        outthis.loadFrag(sFragID,sModelID,sNowHboxID);

                    });
                }
            });
        },
        loadFrag: async function(sFragID,sModelID,sNowHboxID){

            const oFragIF = await Fragment.load({
                id: `${sFragID}`,
                name: "anders.aif.if.overview.view.IFStaticItems",
                type: "XML",
                controller: this
            });
            oFragIF.setModel(this[`${sModelID}`]);
            this[`${sNowHboxID}`].addItem(oFragIF);
            this[`${sFragID}`] = oFragIF;
            this.aFragID.push(sFragID);
            this.aModelID.push(sModelID);
            this.aHBox.push(sNowHboxID);
        },
        handleStatusPressed: function (oEvent) {
            var oDialog = new Dialog({
                title: "Interface Information",
                content: [
                    new VBox({
                        fitContainer: true,
                        items: [
                            new Text({
                                text: `${oEvent.getSource().getBindingContext().getModel().oData.IFStaticItem.title}`
                            }),
                            new Text({
                                text: `${oEvent.getSource().getBindingContext().getObject().title}`
                            }),
                            new Text({
                                text: `${oEvent.getSource().getBindingContext().getObject().text}`
                            })
                        ]
                    })
                ],
                buttons: new Button({
                    text: "OK",
                    press: function (oEvent) {
                        oDialog.close();
                    }
                })
            });
            oDialog.open();
        },
        error: function (err) {
            console.log(err);
        }
    });
});
 //   });

//});
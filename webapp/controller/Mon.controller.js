sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/comp/smartfilterbar/SmartFilterBar",
	"sap/ui/comp/smarttable/SmartTable"
], function (Controller, JSONModel,SmartFilterBar,SmartTable) {
    'use strict';

    return Controller.extend("anders.aif.if.overview.controller.Mon", {
        onInit: function () {

            let oRouter = this.getOwnerComponent().getRouter();
            oRouter.attachRouteMatched(function (oEvent) {
                if (oEvent.getParameter("name") !== "monitor") {
                    return;
                }
                else {
                    let oIFDetail = sap.ui.getCore().getModel("IFPara").getData();
                    let oPage = this.byId("PIFMON");
                    oPage.destroyContent();

                    let ifkey = oIFDetail.ifkey.split(" - ");

                    let pathTmp = "(ip_ns='%ns%',ip_ifname='%ifname%',ip_ifver='%ifver%',ip_status='%status%',uname='%uname%',datetime_from=datetimeoffset'%dtfrom%',datetime_to=datetimeoffset'%dtto%')";

                    pathTmp = pathTmp.replace("%ns%", ifkey[0]);
                    pathTmp = pathTmp.replace("%ifname%", ifkey[1]);
                    pathTmp = pathTmp.replace("%ifver%", ifkey[2]);
                    pathTmp = pathTmp.replace("%status%", oIFDetail.status);
                    pathTmp = pathTmp.replace("%uname%", oIFDetail.uname);
                    pathTmp = pathTmp.replace("%dtfrom%", oIFDetail.dtfrom);
                    pathTmp = pathTmp.replace("%dtto%", oIFDetail.dtto);
                    pathTmp = encodeURIComponent(pathTmp);
                    let idxtbl = oIFDetail.msgtbl.replace(/"/g,'');
                    let pathReq = `/${idxtbl}` + pathTmp + "/Set";
                    let bindPath = `/${idxtbl}` + pathTmp + "/Set";
                    let outthis = this;
                    this.oModelIFSTA.read(pathReq, {
                        method: "GET",
                        success: function (data) { 
                            let mrel = data.results;
                            let oSmartFilter = new SmartFilterBar("IDXKEY", {
                                entitySet: `${idxtbl}Set`
                            });
                            oPage.addContent(oSmartFilter);

                            let oSmartTable = new SmartTable("IFMON", {
                                smartFilterId: "IDXKEY",
                                entitySet: `${idxtbl}Set`,
                                tableBindingPath: bindPath,
                                tableType: "ResponsiveTable",
                                editable: false,
                                useVariantManagement: false,
                                useTablePersonalisation: false,
                                header: "IFMessages",
                                showRowCount: true,
                                useExportToExcel: false
                            });
                            oPage.addContent(oSmartTable);
                        }
                    });
                    /*                     let oFBox = this.byId("IFD");
                                        oFBox.destroyItems();
                                        oFBox.addItem(new sap.m.StandardListItem({ title:"Interface Key:", description: `${oIFDetail.ifkey}` }));
                                        oFBox.addItem(new sap.m.StandardListItem({ title:"Message Idex Table:", description: `${oIFDetail.msgtbl}` }));
                                        oFBox.addItem(new sap.m.StandardListItem({ title:"User Name:", description: `${oIFDetail.uname}` }));
                                        oFBox.addItem(new sap.m.StandardListItem({ title:"Date Time From:", description: `${oIFDetail.dtfrom}` }));
                                        oFBox.addItem(new sap.m.StandardListItem({ title:"Date Time To:", description: `${oIFDetail.dtto}` }));
                                        oFBox.addItem(new sap.m.StandardListItem({ title:"Status:", description: `${oIFDetail.status}` }));
                                        oFBox.addItem(new sap.m.StandardListItem({ title:"Number of Messages:", description: `${oIFDetail.number}` })); */
                }
                // this._selectItemWithId(oEvent.getParameter("arguments").id);
            }, this);


            this.oModelIFSTA = this.getOwnerComponent().getModel('ifsta');
            this.getView().setModel(this.oModelIFSTA);
            // let oIFDetail = sap.ui.getCore().getModel("IFPara");
            /*             let oIFDetail = sap.ui.getCore().getModel("IFPara").getData();
                        let oFBox = this.byId("IFD");
                        oFBox.destroyItems();
                        oFBox.addItem(new sap.m.StandardListItem({ title:"Interface Key:", description: `${oIFDetail.ifkey}` }));
                        oFBox.addItem(new sap.m.StandardListItem({ title:"Message Idex Table:", description: `${oIFDetail.msgtbl}` }));
                        oFBox.addItem(new sap.m.StandardListItem({ title:"User Name:", description: `${oIFDetail.uname}` }));
                        oFBox.addItem(new sap.m.StandardListItem({ title:"Date Time From:", description: `${oIFDetail.dtfrom}` }));
                        oFBox.addItem(new sap.m.StandardListItem({ title:"Date Time To:", description: `${oIFDetail.dtto}` }));
                        oFBox.addItem(new sap.m.StandardListItem({ title:"Status:", description: `${oIFDetail.status}` }));
                        oFBox.addItem(new sap.m.StandardListItem({ title:"Number of Messages:", description: `${oIFDetail.number}` })); */
        }
    });
});

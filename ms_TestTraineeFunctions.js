/*                  APUNTES:

- DEPRECADA => no usar Xrm.Page, solo usar formContext
- executionContext => stx
- 

formContext.getControl('ms_precio').addNotification({
    messages: ['Si precio es nulo, descripcion tambien sera nulo'],
    notificationLevel: 'ERROR'
});

*/


//---------------------------------------------
//  Mostrar datos de la tabla
//---------------------------------------------
function checkDataDepart(executionContext) {
    debugger

    //linea de oro xD
    var formContext = executionContext.getFormContext();

    var precio = formContext.getAttribute('ms_precio').getValue();
    var ciudad = formContext.getAttribute('ms_ciudad').getValue();
    var estado = formContext.getAttribute('ms_estado').getText();
    //var tipo = formContext.getAttribute('ms_estado').getFormat();
    var entidad = formContext.data.entity.getEntityName();

    if (precio !== null) {
        alert("El precio es: $" + precio + " en " + ciudad + ", su estado es " + estado + " y la entidad es " + entidad);
    }
}


//---------------------------------------------
//  Mostrar datos del usuario
//---------------------------------------------
function LookDataUser(executionContext) {
    debugger
    //linea de oro xD
    var formContext = executionContext.getFormContext();

    //nombre de usuario
    var user = formContext.context.getUserName();

    //estado
    var state = formContext.context.client.getClientState()

    //dispositivo
    var formFactor = formContext.context.client.getFormFactor()

    //uid
    var gui = formContext.context.getUserId()

    //datos del cliente => Web
    var data = formContext.context.client.getClient()

    //organizacion => orgc30870af
    var org = formContext.context.getOrgUniqueName();

    //tipo de formulario
    var TypeForm = formContext.ui.getFormType();

    //rol => cadena
    //var rol = Xrm.Page.context.getUserRoles()

    //condicionales para dispositivo
    var r = " ";
    switch (formFactor) {
        case 1:
            r = "Desktop";
            break;
        case 2:
            r = "Tablet";
            break;
        case 3:
            r = "Telefono Movil";
            break;
        default:
            r = "Desconocido";
            break;
    }

    //condicionales para tipo de formulario(faltan)
    var tf = " ";
    switch (TypeForm) {
        case 0:
            tf = "Indefinido";
            break;
        case 1:
            tf = "Crear";
            break;
        case 2:
            tf = "Actualizar";
            break;
        case 3:
            tf = "Solo lectura";
            break;
        default:
            tf = "Indefinido";
            break;
    }

    //alerta
    if (user !== null) {
        alert("Bienvenido " + user + ". Su estado es " + state + " y el dispositivo es " + r + ". Su id es  " + gui + ".");
        alert("Datos del cliente: " + data + "/ Organizacion: " + org + "/ Tipo de formulario " + tf);
    }
}


//---------------------------------------------
//  Setea un campo como oculto a cliente
//---------------------------------------------
function OcultarCampoCliente(executionContext, Cliente, OwnerId) {
    debugger
    // uso de context
    var formContext = executionContext.getFormContext();

    // llamamos a los campos a ocultar
    var option = formContext.getAttribute("ms_cliente").getValue();
    var option2 = formContext.getAttribute("ownerid").getValue();

    // condicionales para cada campo
    if (formContext.getControl("ms_cliente") != null) {
        formContext.getControl("ms_cliente").setVisible(false);
    }

    if (formContext.getControl("ownerid") != null) {
        formContext.getControl("ownerid").setVisible(false);
    }
}

//---------------------------------------------
//  Setea un campo como deshabilitado
//---------------------------------------------
function DesHabilitaCampo(executionContext, Estado) {
    debugger
    var formContext = executionContext.getFormContext();
    formContext.getControl("ms_estado").setDisabled(true);
    formContext.getControl('ms_estado').addNotification({
        messages: ['No puede modificar estado'],
        notificationLevel: 'RECOMMENDATION'
    });
}


//---------------------------------------------
//  Precio => descripcion(precio + ciudad)
//---------------------------------------------
function onChange(executionContext) {
    debugger
    var formContext = executionContext.getFormContext();

    //obtenemos los datos del formulario
    var precio = formContext.getAttribute('ms_precio').getValue();
    var ciudad = formContext.getAttribute('ms_ciudad').getValue();

    //si precio no es nulo => descripcion => precio+ciudad
    if (precio !== null) {
        formContext.getAttribute('ms_descripcion').setValue("" + precio + ciudad);
        formContext.data.save();
    } else {
        formContext.getAttribute('ms_descripcion').setValue(null);
    }
}


//---------------------------------------------
//  Comparar fechas
//---------------------------------------------
function compareFechas(executionContext) {
    debugger
    var formContext = executionContext.getFormContext();

    //obtenemos los datos del formulario
    var fechaLlegada = formContext.getAttribute('ms_fecha_llegada').getValue();
    var fechaSalida = formContext.getAttribute('ms_fecha_salida').getValue();


    //compare
    if (fechaSalida < fechaLlegada) {
        alert('error: sales el ' + fechaSalida + ' y llegas el ' + fechaLlegada);

    } else if (fechaSalida == fechaLlegada) {
        alert('Entra y sale en la misma fecha. ¿Esta seguro?');
    }

}

//-----------------------------------------------------
//      Filtro con js sobre precio reservas vs depart
//-----------------------------------------------------
function filtro(executionContext) {
    debugger
    var formContext = executionContext.getFormContext();

    //tipo de formulario
    var TypeForm = formContext.ui.getFormType();

    //obtener precio
    var precio = formContext.getAttribute('ms_precio').getValue();

    if (precio != 0) {
        //Que mostrare??
        var viewDisplayName = "Departamentos";

        //id de la vista
        var viewId = "{6FD72744-3676-41D4-8003-AE4CDE9AC282}";


        var query =
            `<fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="false">
          <entity name="ms_departamento">
            <attribute name="ms_departamentoid" />
            <attribute name="ms_departamento" />
            <attribute name="ms_ciudad" />
            <order attribute="ms_departamento" descending="false" />
            <filter type="and">
              <condition attribute="ms_precio" operator="le" value="${precio}" />
              <condition attribute="statecode" operator="eq" value="0" />
              <condition attribute="ms_estado" operator="eq" value="100000000" />
            </filter>
          </entity>
        </fetch>`;

        //
        Xrm.WebApi.retrieveMultipleRecords('ms_departamento', "?fetchXml=" + query).then(function (results) {

            //se puede agregar if para validar los resultados
            var layoutXmlAgentSubType = "<grid name='resultset' object='1' jump='ms_departamentoid' select='1' icon='0' preview='1'>";
            layoutXmlAgentSubType += "<row name='result' id='ms_departamentoid'>";
            layoutXmlAgentSubType += "<cell name='ms_departamento' width='150' />";
            layoutXmlAgentSubType += "</row>";
            layoutXmlAgentSubType += "</grid>";


            //campo lookup
            formContext.getControl("ms_departamento").addCustomView(
                //
                viewId, 'ms_departamento', viewDisplayName, query, layoutXmlAgentSubType, true
            );

        },
        function (error) {
            formContext.ui.setFormNotification('Error al filtrar departamentos:' + error.message, 'WARNING', '1');
            formContext.ui.clearFormNotification('1');
        });
    }

}


//-----------------------------------------------------
//      Cambiar valor de estado de depart.
//-----------------------------------------------------
function changeEstado(executionContext) {
    debugger
    const estado = executionContext.getAttribute("ms_estado").getValue();
    
    //si estado es distinto de disponible
    if (estado[0] !== 100000000) {
        executionContext.getAttribute('ms_estado').setValue([100000000]); //asigna disponible
    }else {
        alert("Departamento ya esta disponible");
    }
}

function checkEstado(executionContext){
    debugger
    const value = executionContext.getAttribute("ms_estado").getValue();
    if (value[0] !== 100000000) {
        return true;
    } else {
        return false;
    }
}

//-----------------------------------------------------
//      Limpiar variable precio
//-----------------------------------------------------
function limpiarPrecio(executionContext) {
    debugger
    const precio = executionContext.getAttribute("ms_precio").getValue();

    if ( precio !== 0) {
        executionContext.getAttribute('ms_precio').setValue(0);
    } else {
        alert("precio esta limpio");
    }
}

function buttonCheck(executionContext){
    debugger
    const value = executionContext.getAttribute("ms_precio").getValue();

    if (value !== null) {
        return true;
    } else {
        return false;
    }
}
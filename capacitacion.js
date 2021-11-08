//---------------------------------------------
//  La capacitacion se relaciona a (Proyecto/Caso/No Aplica)
//---------------------------------------------
function Relation(executionContext, Proyecto, Caso) {
    debugger
    var formContext = executionContext.getFormContext();

    var relacion = formContext.getAttribute("cr544_capacitacionrelacion").getValue();

    switch (relacion) {
        case 860090000:
            formContext.getControl("cr544_wit_proyecto").setVisible(true);
            formContext.getControl("cr544_incident").setVisible(false);
            break;
        case 860090001:
            formContext.getControl("cr544_wit_proyecto").setVisible(false);
            formContext.getControl("cr544_incident").setVisible(true);
            break;
        case 860090002:
            formContext.getControl("cr544_wit_proyecto").setVisible(false);
            formContext.getControl("cr544_incident").setVisible(false);
            break;
        default:
            formContext.getControl("cr544_wit_proyecto").setVisible(false);
            formContext.getControl("cr544_incident").setVisible(false);
            break;
    }

}

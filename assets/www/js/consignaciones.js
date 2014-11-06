globales: {
// Configuracion de ruta de archivos:
    if (!window.location.origin)
        window.location.origin = window.location.protocol + "//" + window.location.host;
// Configuracion de la URL base:
//    var base_uri = "http://127.0.0.1/";
    var base_uri = "http://192.168.1.68/";
    // Deteccion de Explorador Movil o PC:
    (function(a) {
        (jQuery.browser = jQuery.browser || {}).mobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))
    })(navigator.userAgent || navigator.vendor || window.opera);
}

function imprimir(str) {
    alert('mandando a imprimir: ' + str);
    app.sendString(str);
//    return str;
}

function imprimirTabla() {
    $('#table-renglones tbody > tr').each(function(index, item) {
//        alert($('#id_producto').html());
        setTimeout(function() {
            imprimir($('#id_producto').html());
        }, 3000);
    });
}

function generarTablaConsignacion(xmlDoc) {
    var xml = $(xmlDoc);
    $('#id_cliente').val(xml.find('consignacion').find('cliente').text());
    var renglonNo = 0;
    $('#table-renglones tbody').empty();
    $('consignacion > renglones > renglon', xml).each(function() {
        $('#table-renglones tbody').prepend($('<tr id="' + (++renglonNo) + '"></tr>')
                .append('<td id="numero-renglon">' + renglonNo + '.</td>')
                .append('<td id="id_producto">' + $(this).find('id_producto').text() + '</td>')
                .append('<td id="cantidad">' + $(this).find('cantidad').text() + '</td>')
                .append('<td id="descripcion">' + $(this).find('descripcion').text() + '</td>')
                .append('<td id="precio">' + $(this).find('precio').text() + '</td>')
                .append('<td>x</td>')
                );
    });
}

function capturarRenglon() {
    var f = 'capturarRenglonPorEAN';
    var valor = $('#input-codigo').val();
    var campo = 'ean';
    var cantidades = 'false';
    $('#input-codigo').val('');
    // Switch entre capturar codigos de barras (EAN) o codigo de producto (id_producto):
    if ($('#slider-ean').val() === 'off') {
        campo = 'id_producto';
        f = 'capturarRenglonPorCodigo';
    }
    if ($('#slider-cantidades').val() === 'off') {
        cantidades = 'true';
    }
    $.post(base_uri + '_controlador/renglones_controlador.php',
            {f: f, valor: valor, campo: campo, cantidades: cantidades},
    function(data) {
        if (data !== 'vacio') {
            var xml = data;
            xmlDoc = $.parseXML(xml);
            $xml = $(xmlDoc);
            var renglonNo = 0;
            $('#table-renglones tbody').prepend($('<tr id="' + (++renglonNo) + '"></tr>')
                    .append('<td id="numero-renglon">' + renglonNo + '.</td>')
                    .append('<td id="id_producto">' + $xml.find('id_producto').text() + '</td>')
                    .append('<td id="cantidad">' + 1 + '</td>')
                    .append('<td id="descripcion">' + $xml.find('descripcion').text() + '</td>')
                    .append('<td id="precio">$ ' + $xml.find('precio').text() + '</td>')
                    .append('<td>x</td>')
                    );
            $('#input-codigo').focus();
            var snd = new Media("file:///android_asset/www/sounds/beep-7.mp3");
            snd.play();
        }
        else {
            $('#input-codigo').focus();
            var snd = new Media("file:///android_asset/www/sounds/beep-3.mp3");
            snd.play();
        }
    });

}

// JQuery funcion inicial:
$(document).ready(function() {
    $('#button-imprimir').click(function() {
        imprimirTabla();
    });
    $('#button-opciones-aceptar').click(function() {
        history.back(); // No es buena practica. Cambiar luego.
        alert('clicked');
        $('#input-codigo').focus();
    });
    $('#download-xml').click(function() {
        var id_cliente = '999';
        $.post(base_uri + '_controlador/consignaciones_controlador.php',
                {f: 'ajaxBuscarConsignacionesCliente', id_cliente: id_cliente},
        function(data) {
            if (data != 'vacio') {
                var consignaciones = $.parseJSON(data);
                $.mobile.changePage('#dialog-consignaciones-listado');
                $('#id_cliente-consignaciones-listado').val(id_cliente);
                $('#table-consignaciones-listado tbody').empty();
                $($(consignaciones).get().reverse()).each(function(index, item) {
//                    $.each(this, function(index, item) {
                    $('#table-consignaciones-listado tbody').prepend($('<tr id="consignacion" id-consignacion="' + item.id_consignacion + '"></tr>')
                            .append('<td>' + item.id_consignacion + '</td>')
//                                .append('<td>' + item.numero_renglones + '</td>')
                            .append('<td>$ ' + parseFloat(item.total).toFixed(2) + '</td>')
                            .append('<td>' + item.fecha + '</td>')
                            .append('<td>' + item.estatus + '</td>')
                            );
//                    });
//                    $.each(this, function(index, item) {
//                        if (index == "fecha") {
//                            alert(item.date);
//                        }
//                        else {
//                            alert(item);
//                        }
//                    );
                });
                $('tr#consignacion').click(function() {
                    history.back(); // No es buena practica. Cambiar luego.
                    $('#input-codigo').focus();
                    var id_consignacion = $(this).attr('id-consignacion');
                    $.post(base_uri + '_controlador/consignaciones_controlador.php',
                            {f: 'ajaxDescargarConsignacionXML', id_consignacion: id_consignacion},
                    function(data) {
                        if (data !== 'vacio') {
                            xmlDoc = $.parseXML(data);
                            generarTablaConsignacion(xmlDoc);
                        }
                        else {
                        }
                    });
                });
            }
            else {
            }
        });
    });
    $('#ip').val(base_uri);
    $('#input-submit').click(function() {
        capturarRenglon();
    });
    $('#button-opciones-aceptar').click(function() {
        base_uri = $('#ip').val();
    });
    $('#load-xml').click(function() {
        $('#files').click();
    });
    $('#input-codigo').click(function() {
        $('#input-codigo').val('');
    });
    $('#input-codigo').focus();
//    $('[type="file"]').button({value: 'xml'});
//    $('#dialog-opciones').dialog({autoOpen: false});
//    $('#button-opciones').click(function() {
//        $.mobile.changePage( "#dialog-opciones", { role: "dialog" } );
////        $('#dialog-opciones').dialog('open');
//        return false;
//    });
    $('#input-codigo').keypress(function(e) {
        if (e.which == 13) {
            capturarRenglon();
        }
    });


    function handleFileSelect(evt) {
        var files = evt.target.files; // FileList object

        // files is a FileList of File objects. List some properties.
        var output = [];
        for (var i = 0, f; f = files[i]; i++) {
            output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                    f.size, ' bytes, last modified: ',
                    f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                    '</li>');
//            document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';

            var reader = new FileReader();

            // Closure to capture the file information.
            reader.onload = (function(theFile) {
                return function(e) {
                    var data = e.target.result;

                    xmlDoc = $.parseXML(data);
                    var xml = $(xmlDoc);
                    $('#id_cliente').val(xml.find('consignacion').find('cliente').text());
                    var renglonNo = 0;
                    $('#table-consignaciones-listado tbody').empty();
                    $('consignacion > renglones > renglon', xml).each(function() {
//                        alert($(this).text());
                        $('#table-renglones tbody').prepend($('<tr id="' + (++renglonNo) + '"></tr>')
                                .append('<td id="numero-renglon">' + renglonNo + '.</td>')
                                .append('<td id="id_producto">' + $(this).find('id_producto').text() + '</td>')
                                .append('<td id="cantidad">' + $(this).find('cantidad').text() + '</td>')
                                .append('<td id="descripcion">' + $(this).find('descripcion').text() + '</td>')
                                .append('<td id="precio">$ ' + $(this).find('precio').text() + '</td>')
                                .append('<td>x</td>')
                                );
                    });
//                    $( ".button-borrar a" ).attr('class',"ui-icon ui-icon-trash").attr('title','Eliminar');
//                    var span = document.createElement('span');
//                    span.innerHTML = str;
//                            span.innerHTML = ['<p>', str, '</p>'].join('');
//                    document.getElementById('list').insertBefore(span, null);
                };
            })(f);

            // Read in the image file as a data URL.
            reader.readAsText(f, "UTF-8");
//                    reader.readAsText(f);
//                    reader.readAsDataURL(f);
        }
    }

    document.getElementById('files').addEventListener('change', handleFileSelect, false);
});
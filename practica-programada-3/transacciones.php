<?php
$transacciones = [
    ["descripcion" => "Compra en Supermercado", "monto" => 1500],
    ["descripcion" => "Pago de servicios", "monto" => 15000],
    ["descripcion" => "Gasolina", "monto" => 7000],
    ["descripcion" => "Compra en linea", "monto" => 25000],
    ["descripcion" => "Compra en Supermercado", "monto" => 3500],
    ["descripcion" => "Compra en Supermercado", "monto" => 8500],
    ["descripcion" => "Pago de servicios", "monto" => 13000],
    ["descripcion" => "Gasolina", "monto" => 5000],
    ["descripcion" => "Compra en Linea", "monto" => 14500],
    ["descripcion" => "Gasolina", "monto" => 6000],
];

$montoTotalContado = 0;
foreach ($transacciones as $transaccion) {
    $montoTotalContado += $transaccion["monto"];
}

//interés del 2.6%
$interes = 0.026;
$montoConInteres = $montoTotalContado * (1 + $interes);

//cashback 0.1% 
$cashBack = $montoTotalContado * 0.001;

echo "Estado de Cuenta\n";
echo "----------------\n";
echo "Transacciones:\n";
foreach ($transacciones as $transaccion) {
    echo "Descripción: {$transaccion['descripcion']} - Monto: {$transaccion['monto']}\n";
}
echo "\nMonto total de contado: $montoTotalContado\n";
echo "Monto total con interés del 2.6%: " . number_format($montoConInteres, 2) . "\n";
echo "Cash Back aplicado (0.1%): " . number_format($cashBack, 2) . "\n";
echo "Monto final a pagar: " . number_format($montoConInteres - $cashBack, 2) . "\n";

$archivo = fopen("estado_cuenta.txt", "w") or die("No se puede abrir el archivo");
$txt = "Estado de Cuenta\n\n";
$txt .= "Transacciones:\n";
foreach ($transacciones as $transaccion) {
    $txt .= "Descripción: {$transaccion['descripcion']} - Monto: {$transaccion['monto']}\n";
}
$txt .= "\nMonto total de contado: $montoTotalContado\n";
$txt .= "Monto total con interés del 2.6%: " . number_format($montoConInteres, 2) . "\n";
$txt .= "Cash Back aplicado (0.1%): " . number_format($cashBack, 2) . "\n";
$txt .= "Monto final a pagar: " . number_format($montoConInteres - $cashBack, 2) . "\n";

fwrite($archivo, $txt);
fclose($archivo);

echo "\nEstado de cuenta generado y guardado en 'estado_cuenta.txt'.\n";
?>
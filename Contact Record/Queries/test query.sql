--esta query es la que usa el drop down para completar la informacion del contact record, 
--Se va a modificar para que pueda joinear entre la tabla contact Record y Individual Record
SELECT
    DISTINCT [Business Name],
    [First Name],
    [Last Name],
    [MI],
    [Email Address],
    [Work Phone],
    [Cell Phone],
    [Street Address],
    [Room Suite],
    [Zip Code],
    [City],
    [ddState],
    [ddCounty],
    [dhid]
FROM
    [Contact Record]
WHERE
    [dhid] = @Value
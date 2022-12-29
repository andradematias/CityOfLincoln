--esta query es la que usa el drop down para completar la informacion del contact record, 
--Se va a modificar para que pueda joinear entre la tabla contact Record y Individual Record
SELECT
    DISTINCT [Contact Record].[Business Name],
    [Contact Record].[First Name],
    [Contact Record].[Last Name],
    [Contact Record].[MI],
    [Contact Record].[Email Address],
    [Contact Record].[Work Phone],
    [Contact Record].[Cell Phone],
    [Contact Record].[Street Address],
    [Contact Record].[Room Suite],
    [Contact Record].[Zip Code],
    [Contact Record].[City],
    [Contact Record].[ddState],
    [Contact Record].[ddCounty],
    [Contact Record].[dhid],
    [Individual Record].[Individual ID]
FROM
    [Contact Record]
    INNER JOIN [Individual Record] ON [Contact Record].[Email Address] = [Individual Record].[Email Address]
WHERE
    [Contact Record].[dhid] = @Value
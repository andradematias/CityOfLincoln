SELECT
    [OpPerm Operational Permit].[original Permit ID],
    [OpPerm Operational Permit].[Health Care Group],
    [OpPerm Operational Permit].[ClassificationDD],
    [OpPerm Operational Permit].[maximum Occupancy],
    [OpPerm Operational Permit].[number of Rooms],
    [OpPerm Operational Permit].[number of Beds],
    [OpPerm Operational Permit].[number of Spaces],
    [OpPerm Operational Permit].[health Care Type],
    [OpPerm Operational Permit].[Liquor License Number],
    [OpPerm Operational Permit].[Liquor License Type],
    [OpPerm Operational Permit].[Liquor License Class],
    [OpPerm Operational Permit].[Number of Booths],
    [OpPerm Operational Permit].[Approved Booth],
    [OpPerm Operational Permit].[Approved Storage],
    [OpPerm Operational Permit].[Flammable Liquids],
    [OpPerm Operational Permit].[Approved Mixing],
    [OpPerm Operational Permit].[Extinguishing System],
    [OpPerm Operational Permit].[Mixing],
    [OpPerm Operational Permit].[Child Care Category],
    [OpPerm Operational Permit].[Child Care Type],
    [OpPerm Operational Permit].[From Hours],
    [OpPerm Operational Permit].[From Minutes],
    [OpPerm Operational Permit].[From AM PM],
    [OpPerm Operational Permit].[To Hours],
    [OpPerm Operational Permit].[To Minutes],
    [OpPerm Operational Permit].[To AM PM],
    [OpPerm Operational Permit].[Child Care Restrictions],
    [OpPerm Operational Permit].[Business ID],
    [OpPerm Operational Permit].[Operational Permit Type],
    [OpPerm Operational Permit].[OperationalPermitID],
    [Contact Record].[Facility Name],
    CONCAT(
        [Contact Record].[Facility Street Address],
        ' ',
        [Contact Record].[Facility Room Suite],
        ' ',
        [Contact Record].[Facility City],
        ' ',
        [Contact Record].[Facility State],
        ' ',
        [Contact Record].[Facility Zip Code]
    ) AS 'Facility Address'
FROM
    [OpPerm Operational Permit]
    INNER JOIN [Designee] ON [Designee].[Operational Permit ID] = [OpPerm Operational Permit].[OperationalPermitID]
    INNER JOIN [Contact Record] ON [Contact Record].[Record ID] = [Designee].[Contact ID]
WHERE
    [Contact Record].[Status] = 'Active'
    AND [Designee].[Status] = 'Active'
    AND ([Designee].[Type Facility] = 'true')
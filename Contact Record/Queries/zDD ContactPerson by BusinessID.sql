SELECT
    DISTINCT dhid,
    Concat (
        [First Name],
        ' ',
        [Last Name],
        ':  ',
        CASE
            WHEN [Type Manager] = 'true' then 'Manager   '
            else ''
        END,
        CASE
            WHEN [Type On Site] = 'true' then 'On Site   '
            else ''
        END,
        CASE
            WHEN [Type Billing] = 'true' then 'Billing   '
            else ''
        END,
        CASE
            WHEN [Owner Contact] = 'true' then 'Owner   '
            else ''
        END
    ) AS Type
FROM
    [Contact Record]
WHERE
    [Status] = 'Active'
    AND [Business ID] = @Value
    AND (
        [Type Manager] = 'true'
        OR [Type On Site] = 'true'
        OR [Type Billing] = 'true'
        OR [Owner Contact] = 'true'
    )
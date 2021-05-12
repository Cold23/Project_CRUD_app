UPDATE transcaction AS t 
SET 
    t.total_price = (SELECT 
            ROUND(SUM(c.amount * i.current_price),
                    2)
        FROM
            contains AS c,
            item AS i
        WHERE
            c.transcaction_id = t.id
                AND c.barcode = i.barcode),
    t.total_pieces = (SELECT 
            SUM(c.amount)
        FROM
            contains AS c,
            item AS i
        WHERE
            c.transcaction_id = t.id
                AND c.barcode = i.barcode)
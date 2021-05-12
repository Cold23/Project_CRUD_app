SELECT 
    bday_alc.card_id,
    ROUND((bday_alc.amount * 100) / (alc.total),2) AS perc_of_total_in_bday,
    married,
    children AS no_of_children
FROM
    (SELECT 
        c.card_id,
            SUM(tc.amount) AS amount,
            c.married AS married,
            c.children AS children
    FROM
        customer AS c
    JOIN transcaction AS t
    JOIN contains AS tc
    JOIN item AS i ON tc.transcaction_id = t.id
        AND tc.barcode = i.barcode
        AND i.category_id = 2
        AND c.card_id = ${card_id}
        AND c.card_id = t.card_id
        AND WEEK(t.date) BETWEEN WEEK(CONCAT(YEAR(t.date), '-', MONTH(c.birth_date), '-', DAY(c.birth_date))) - 1 AND WEEK(CONCAT(YEAR(t.date), '-', MONTH(c.birth_date), '-', DAY(c.birth_date)))
    GROUP BY c.card_id) AS bday_alc
        JOIN
    (SELECT 
        c.card_id, SUM(tc.amount) AS total
    FROM
        customer AS c
    JOIN transcaction AS t
    JOIN contains AS tc
    JOIN item AS i ON tc.transcaction_id = t.id
        AND tc.barcode = i.barcode
        AND i.category_id = 2
        AND c.card_id = t.card_id
    GROUP BY c.card_id) AS alc ON bday_alc.card_id = alc.card_id
ORDER BY bday_alc.card_id LIMIT 1
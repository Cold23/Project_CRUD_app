SELECT a.card_id,a.cat, ROUND(MAX(a.sumcount)/sum(sumcount) * 100,2) as t FROM
(SELECT 
   c.card_id, cate.name as cat, SUM(tc.amount) as sumcount
FROM
    customer AS c
        JOIN
    transcaction AS t
        JOIN
    contains AS tc
        JOIN
    item AS i
    JOIN
    category as cate 
    ON c.card_id = t.card_id
        AND i.barcode = tc.barcode
        AND t.id = tc.transcaction_id
        AND i.category_id = cate.category_id
        GROUP BY c.card_id, i.category_id) as a GROUP BY a.card_id
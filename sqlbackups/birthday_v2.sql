SELECT bday_alc.card_id, (bday_alc.amount*100)/(alc.total) AS perc_of_total_in_bday, married, children AS no_of_children FROM 
(
SELECT c.card_id, SUM(tc.amount) AS amount , c.married AS married, c.children AS children
FROM customer AS c 
JOIN transcaction AS t 
JOIN contains AS tc 
JOIN item AS i 
ON tc.transcaction_id = t.id 
AND tc.barcode = i.barcode 
AND i.category_id = 2  
AND c.card_id = t.card_id 
AND WEEK(t.date) BETWEEN WEEK(concat(year(t.date),'-',month(c.birth_date),'-',day(c.birth_date)))-1 AND WEEK(concat(year(t.date),'-',month(c.birth_date),'-',day(c.birth_date))) 
GROUP BY c.card_id
) AS bday_alc 

JOIN 
(
SELECT c.card_id, sum(tc.amount) AS total 
FROM customer AS c 
JOIN transcaction AS t 
JOIN contains AS tc 
JOIN item AS i 
ON tc.transcaction_id = t.id 
AND tc.barcode = i.barcode 
AND i.category_id = 2
AND c.card_id = t.card_id 
GROUP BY c.card_id 
)AS alc ON bday_alc.card_id = alc.card_id ORDER BY bday_alc.card_id
SELECT sum(tc.amount) as bam,cat.name,c.married FROM customer as c join transcaction as t join contains as tc join item as i join category as cat 
ON c.card_id = t.card_id AND t.id = tc.transcaction_id and i.barcode = tc.barcode and i.category_id = cat.category_id 
GROUP by c.married,cat.name 
order by cat.name
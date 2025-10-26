SELECT A.id, A.name,  Sp.name As species,
G.name As gender , Sz.name As size, Slt.name As shelter, Ans.name As statuse,
A.age_months,  A.is_neutered, A.is_house_trained, A.vaccination_status,
A.breed, A.description, A.image_url
FROM pet_adoption.animals As A 
inner join pet_adoption.species As Sp
on A.species_id = Sp.id
inner join gender_types As G
on A.gender_id= G.id
inner join sizes As Sz
on A.size_id = Sz.id
inner join shelters As Slt
on A.shelter_id= Slt.id
inner join animal_statuses As Ans
on A.status_id = Ans.id

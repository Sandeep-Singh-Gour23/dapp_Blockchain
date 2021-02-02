
exports.up = function(knex) {
    return knex.schema.createTable("user",function(table){
        table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
        table.string("fullName");
        table.string("accHash").unique();
        table.string("email").notNullable().unique();
        table.string("password").notNullable();
        table.string("image").defaultTo("https://www.securityindustry.org/wp-content/uploads/sites/3/2018/05/noimage.png");
         
        table.timestamps(false, true);
    })
  
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists("user");
};

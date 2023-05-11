Bring over backend crud files for Laptop from team02

# Acceptance Criteria:

- [ ] The `@Entity` class called Laptop.java has been copied from the team02 repo to the team03 repo and committed.
- [ ] The `@Repository` class called `LaptopRepository.java` has been copied from the team02 repo to the team03 repo and committed.  (Note that the file should be `LaptopRepository.java`; the team02 instrutions erronously called it `Laptop.java`; if you called it `Laptop.java` please update the name now)
- [ ] The `@Repository` class called `LaptopRepository.java` has been copied from the team02 repo to the team03 repo and committed.  (Note that the file should be `LaptopRepository.java`; the team02 instrutions erronously called it `Laptop.java`; if you called it `Laptop.java` please update the name now)
- [ ] The controller file `LaptopController.java` is copied from team02 to team03
- [ ] The controller tests file `LaptopControllerTests.java` is copied from team02 to team03

- [ ] You can see the `laptops` table when you do these steps:
      1. Connect to postgres command line with 
         ```
         dokku postgres:connect team03-qa-db
         ```
      2. Enter `\dt` at the prompt. You should see
         `laptops` listed in the table.
      3. Use `\q` to quit

- [ ] The backend POST,GET,PUT,DELETE endpoints for `Laptop` all work properly in Swagger.


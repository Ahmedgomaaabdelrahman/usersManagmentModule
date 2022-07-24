const usersManagement = {
    listOfUsers : {
        1 : {
            
            firstName:"Olive",
            lastName:"Yew",
            email:"Olive@Yew.com",
            role:"Doctor",
            status:"Active"
        },
        2 : {
            firstName:"Aida",
            lastName:"Buggy",
            email:"Aida@Bugg.com",
            role:"Accountant",
            status:"Active"
        },
        3 : {
            firstName:"Maureen",
            lastName:"Biologist",
            email:"Maureen@Biologist.com",
            role:"Accountant",
            status:"Inactive"
        },
        4 : {
            firstName:"Teri",
            lastName:"Dactyl",
            email:"Teri@Dactyl.com",
            role:"Admin",
            status:"Active"
        },
        5: {
            firstName:"Peg",
            lastName:"Legg",
            email:"Peg@Legg.com",
            role:"Doctor",
            status:"Inactive"
        },
        6 : {
            firstName:"Allie",
            lastName:"Grater",
            email:"Allie@Grater.com",
            role:"Admin",
            status:"Inactive"
        },
    },
    
    Elements:{
        userForm: document.getElementById('user-form'),
        userID:document.getElementById("user_id"),
        firstName:document.getElementById("inputFirstName"),
        lastName:document.getElementById("inputLastName"),
        email:document.getElementById("inputEmail"),
        role:document.getElementById("inputRole"),
        status:document.getElementById("inputStatus"),
        tableBody: document.getElementById("users_table_body"),
        saveUserDataButton : document.getElementById("save_user_data"),
        modalTitle : document.getElementById("add_edit_user_title"),
        addEditUserModal : $('.add-edit-user-modal'),
        emailValidation:document.getElementById(`inputEmail_validation`),
    },

    /**
     * @description Bind all events and draw the user management table it is called in the html file as the first function.
     */
    bindManageUsersUI(){
        // draw table
        usersManagement.drawUsersTable();

        // trigger when click on save user data in the modal
        usersManagement.Elements.saveUserDataButton.addEventListener('click' , usersManagement.saveUserData );

        // Show add/edit user modal 
        usersManagement.Elements.addEditUserModal.on('show.bs.modal', function (e) {
            const userID = $(e.relatedTarget).data("id");
            if(userID){
                usersManagement.Elements.modalTitle.innerText = "Edit User" ;
                const formData = usersManagement.listOfUsers[userID];
                usersManagement.showUserData(userID,formData);
            }
            else { 
                usersManagement.Elements.modalTitle.innerText = "Add User";
            }
        });

        // Hide add/edit user modal
        usersManagement.Elements.addEditUserModal.on('hidden.bs.modal', function (e) {
            usersManagement.Elements.userID.value = '';
            usersManagement.Elements.firstName.value = '';
            usersManagement.Elements.lastName.value = '';
            usersManagement.Elements.email.value = '';
            usersManagement.Elements.role.value = '';
            usersManagement.Elements.status.value = '';

            const user_form = usersManagement.Elements.userForm;

            // start loop from 1 to skip the id hidden element and length -1 to skip save button
            for (let i = 1 ; i < user_form.elements.length - 1 ; i++) {
                user_form.elements[i].classList.remove("is-invalid");
                document.getElementById(`${user_form.elements[i].id}_validation`).innerText = '';
            }
        });

        
    },
    /**
     * @description Add a new user in the user management table
     * @param {number} userID - The user id that will be added.
     * @param {object} userData - The user data object which contains first name, last name, email, role and status.
     */
    addUserInTable(userID, userData){
        const userDataRow = `<tr>
                                <th scope="row">${userID}</th>
                                <td>${userData.firstName}</td>
                                <td>${userData.lastName}</td>
                                <td>${userData.email}</td>
                                <td>${userData.role}</td>
                                <td>${userData.status}</td>
                                <td class="text-center">
                                    <button type="button" class="mt-1 btn btn-sm edit-user-btn" data-toggle="modal" data-target=".add-edit-user-modal" data-id=${userID} >Edit</button>
                                    <button type="button" class="mt-1 btn btn-sm delete-user-btn" data-id=${userID} >Delete</button>
                                </td>
                             </tr>`;
                            
        
        usersManagement.Elements.tableBody.innerHTML += userDataRow;
        
    },
    
    /**
     * @description Callback function that will be called when click on edit user to show this user data.
     * @param {number} userID - The user id that will be added.
     * @param {object} userData - The user data object which contains first name, last name, email, role and status.
     */
    showUserData(userID, userData){
        usersManagement.Elements.userID.value = userID;
        usersManagement.Elements.firstName.value = userData["firstName"];
        usersManagement.Elements.lastName.value = userData["lastName"];
        usersManagement.Elements.email.value = userData["email"];
        usersManagement.Elements.role.value = userData["role"];
        usersManagement.Elements.status.value = userData["status"];
    
    },
    
    /**
     * @description Save user data object in listOfUsers object when add or edit this user after checking the user data validations.
    */
    saveUserData(){
        if(!usersManagement.validateUserData()) {
            const userID =  usersManagement.Elements.userID.value;
            const userDataObj = {
                firstName : usersManagement.Elements.firstName.value,
                lastName: usersManagement.Elements.lastName.value,
                email : usersManagement.Elements.email.value,
                role: usersManagement.Elements.role.value,
                status : usersManagement.Elements.status.value
            };

            // Edit user case
            if(userID){
                usersManagement.listOfUsers[userID] = userDataObj;
            }
            // Add new user case
            else{
                // I tried to get the most logic for creating ID as the database by get the last ID value + 1
                const newUserID = Object.keys(usersManagement.listOfUsers).length > 0 ? Math.max(...Object.keys(usersManagement.listOfUsers)) + 1 : 1;


                usersManagement.listOfUsers[newUserID] = userDataObj;
            }  

            usersManagement.drawUsersTable();
            usersManagement.Elements.addEditUserModal.modal('hide');
        }
    },

    /**
     * @description This function is used to draw the user management table
    */
    drawUsersTable(){
        usersManagement.Elements.tableBody.innerHTML = "";
        if(Object.keys(usersManagement.listOfUsers).length > 0) {
            Object.keys(usersManagement.listOfUsers).forEach(userID => {
                usersManagement.addUserInTable(userID , usersManagement.listOfUsers[userID]);
            });
    
            // Add delete event listener.
            document.querySelectorAll('.delete-user-btn').forEach(item => {
                item.addEventListener('click',  usersManagement.deleteUserFromTale);
            });
        }
        else{ 
            // If there is no users in listOfUsers object 
            usersManagement.Elements.tableBody.innerHTML = `<tr>
                <th scope="row" class="empty-table" colspan="7"> There is no users exist  </th>
            </tr>`;
        }
       

    },
    
    /**
     * Check user data required validation before saving this data.
     * @returns errorExist - it is a boolean variable to indicate if there is an error or not.
     */
    validateUserData(){
        let errorExist = false;
        const user_form = usersManagement.Elements.userForm;
    
        // start loop from 1 to skip the id hidden element and length -1 to skip save button
        for (let i = 1 ; i < user_form.elements.length - 1 ; i++) {
            user_form.elements[i].classList.remove("is-invalid");
            document.getElementById(`${user_form.elements[i].id}_validation`).innerText = '';
    
            if(!user_form.elements[i].value) {
                user_form.elements[i].classList.add("is-invalid");
                document.getElementById(`${user_form.elements[i].id}_validation`).innerText = `Please ${user_form.elements[i].title}`;
                errorExist = true;
            };
        }
    
        for( let [userID, userData] of Object.entries(usersManagement.listOfUsers) ){
            if( userID != usersManagement.Elements.userID.value && (userData["email"]).trim() == (usersManagement.Elements.email.value).trim()){
                usersManagement.Elements.email.classList.add("is-invalid");
                usersManagement.Elements.emailValidation.innerText = `This Email is exist, Please enter another Email`;
                errorExist = true;
            }
        }
        return errorExist;
    
    },

    /**
     * Callback function that will be triggered when click on delete user button.
     * @param {Event} evt - Click event to get the element that was clicked.
     */
    deleteUserFromTale(evt){ 
        evt.preventDefault();
        const userID = evt.target.getAttribute("data-id");
        delete usersManagement.listOfUsers[userID];
        usersManagement.drawUsersTable();
    }
};













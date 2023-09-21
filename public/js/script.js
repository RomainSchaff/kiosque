

/***************************************************************************************************/
/****************************************** KIOSQUE V2 ********************************************/
const maincontent_allresult_container = document.getElementById('maincontent_allresult_container');
const maincontent_allresult_innercontainer = document.getElementById('maincontent_allresult_innercontainer');
const main_content_container = document.getElementById('main_content_container');
const maincontent_genericbox = document.getElementById('maincontent_genericbox');
const maincontent_sessionbox = document.getElementById('maincontent_sessionbox');
const searchbar_input = document.getElementById('searchbar_input');

let allDatasArray = [];
let interfacesArray = [];
let categoriesArray = [];
let configArray = [];
let notificationArray = [];
let sessionArray = [];



/******************** GET ALL DATAS *********************/
async function getAllData() {
      try 
      {
            const response = await fetch("/api/getAllDatas", 
            {
                  method: "GET",
            });
            const result = await response.text();
            allDatasArray = [];
            allDatasArray = JSON.parse(result);

            interfacesArray = allDatasArray.interfaces;
            categoriesArray = allDatasArray.categories;
            configArray = allDatasArray.configurations;
            notificationArray = allDatasArray.notifications;
            sessionArray = allDatasArray.sessions;
            addFirstTimeData();

            let notifUnseenNumb = 0;
            for(let i = 0; i < notificationArray.length; i++)
            {
                  if(notificationArray[i].seen == 0)
                  notifUnseenNumb++;
            }
            handleNotifNumber(notifUnseenNumb);

            
            //First message
            configurationMessage = allDatasArray.configurations;
            notificationsMessage =  allDatasArray.notifications[0].id;
            saveLastMsg = {configurations: configurationMessage, notifications: notificationsMessage};

            console.log("allDatasArray : ", allDatasArray);

            startSocket();

      } 
      catch (error)
      {
            console.error("Error:", error);
      }
}


/******************** GET CHECK NEWS *********************/
async function getCheckNews() {
      try 
      {
            const response = await fetch("/api/checkNews", 
            {
                  method: "GET",
            });
            const result = await response.json();

            // handleNotifNumber(result.countNotifications[0].count_unseen_notifications);
            console.log("checkNews : ", result);
      } 
      catch (error)
      {
            console.error("Error:", error);
      }
}


/******************************************************************************************************************************************/
/************************************************************************* HANDLE SHOW DATAS *********************************************/
function addFirstTimeData()
{
      for(let i = 0; i < interfacesArray.length; i++)
      {
            buildInterfaceContainer(interfacesArray[i]);
      }
}


/******************** HANDLE BOX INFOS **********************/
const box_name = document.getElementById('box_name');
const date_time_container = document.getElementById('date_time_container');
const boxsignal_barbox = document.getElementById('boxsignal_barbox');

function handleBoxInfos(boxInfos)
{
      for(let i = 0; i < boxInfos.length; i++)
      {
            //Handle box name
            if(boxInfos[i].key == "BOX_NAME")
            {
                  box_name.innerHTML = boxInfos[i].value;
            }

            //Handle last update
            if(boxInfos[i].key == "LAST_SEEN")
            {
                  date_time_container.children[0].innerHTML = boxInfos[i].value;
            }

            //Handle Signal
            if(boxInfos[i].key == "LINK_QUALITY")
            {
                  let numb = parseInt(boxInfos[i].value);
                  for(let j = 0; j < numb; j++)
                  {
                        boxsignal_barbox.children[j].style.background = "#3bb54a";
                  }
            }
      }
}

/******************** HANDLE BUILD ALL GENERIC CATEGORIES *********************/
function buildGenericCategories(category)
{
      let newGenericCategory = document.createElement('div');
      newGenericCategory.setAttribute('class', "generic_category_box");
      newGenericCategory.id = `generic_category_box_${category.id_cat}`;
      newGenericCategory.id_cat = category.id_cat;
      newGenericCategory.all_id_interface = [];
      newGenericCategory.innerHTML = `
            <p>${category.name}</p>
      `;
      newGenericCategory.style.background = category.color;
      maincontent_allresult_innercontainer.appendChild(newGenericCategory);


      //Handle store interface in categories
      for(let i = 0; i < interfacesArray.length; i++)
      {
            let el = interfacesArray[i];
            if(typeof el.categories != "undefined")
            {
                  for(let j = 0; j < el.categories.length; j++)
                  {
                        if(el.categories[j] == category.name)
                        {
                              if(newGenericCategory.all_id_interface.includes(el.id) == false)
                                    newGenericCategory.all_id_interface.push(el.id);
                        }
                  }
            }
            
      }

      //Handle click on categories
      newGenericCategory.addEventListener('click', openCategory);
}

function openCategory()
{
      if(this.all_id_interface.length != 0)
      {
            maincontent_allresult_innercontainer.innerHTML = "";
            maincontent_allresult_innercontainer.style.flexWrap = "nowrap";
            maincontent_allresult_innercontainer.style.flexDirection = "column";
            maincontent_allresult_innercontainer.style.justifyContent = "flex-start";
      }

      for(let i = 0; i < allDatasArray.interfaces.length; i++)
      {
            for(let j = 0; j < this.all_id_interface.length; j++)
            {
                  if(allDatasArray.interfaces[i].id == this.all_id_interface[j])
                  {
                        buildInterfaceContainer(allDatasArray.interfaces[i]);
                  }
            }
      }
}


/************************************* HANDLE BUILD INTERFACE BOX AND ADD IN DOM ********************************/
function buildInterfaceContainer(interface)
{
      let index = interface.id;

      let newInterfaceContainer = document.createElement('div');
      newInterfaceContainer.setAttribute('class', 'interface_container');
      newInterfaceContainer.id = `interfacebox_${index}`;
      newInterfaceContainer.interfaceid = index;
      newInterfaceContainer.title = interface.title;
      newInterfaceContainer.path = interface.path;

      //Get date_tournage
      let date_tournage = `${parseDate(interface.date_tournage).finalDate}`;
      newInterfaceContainer.date_tournage = date_tournage;

      //In case we have search something already in input
      if(interface.title.toLowerCase().includes(searchbar_input.value.toLowerCase()))
            newInterfaceContainer.style.display = "flex";
      else
            newInterfaceContainer.style.display = "none";

      

      let color = "var(--specific-color)";
      let colorLight = "var(--specific-color-light)";
      let type = "spécifique";
      newInterfaceContainer.type = "specific";

      if(typeof interface.categories != "undefined")
      {
            if(interface.categories.length > 0)
            {
                  color = "var(--generic-color)";
                  colorLight = "var(--generic-color-light)";
                  type = "générique";
                  newInterfaceContainer.type = "generic";
            }
      }
      else
      {
            console.log('Interface without categorie');
      }
    

      //Handle date format
      let updateDate = `${parseDate(interface.updated_at).finalDate} - ${parseDate(interface.updated_at).finalTime}`;

      //Style
      newInterfaceContainer.style.background = colorLight;

      newInterfaceContainer.innerHTML = `
            <div class="interface_contentbox">
                  <div class="interface_contentbox_topinfosbox">
                        <p class="interface_category" id="interface_category_${index}" style="background:${color};">${type}</p>
                        <p class="interface_date_update" id="interface_date_update_${index}">${updateDate}</p>
                  </div>
                  <div class="interface_contentbox_maininfosbox">
                        <p class="interface_numseq" id="interface_numseq_${index}" style="color:${color};">${interface.num_seq}</p>
                        <p class="interface_datetournage" id="interface_datetournage_${index}" >${date_tournage}</p>
                        <p class="interface_description" id="interface_description_${index}" >${interface.title}</p>
                  </div>
            </div>
            <div class="interface_remote_iconbox">
                  <img src="/assets/remote_icon.svg" alt="">
            </div>
      `;

      maincontent_allresult_innercontainer.appendChild(newInterfaceContainer);

}


/********************************* HANDLE SESSION DATE ***************************/
const date_session = document.getElementById('date_session');

function handleSession(sessionInfos)
{
      let currDate = currentDate();
      let day = parseInt(currDate.split("/")[0]);
      let month = parseInt(currDate.split("/")[1]);
      let year = parseInt(currDate.split("/")[2]);

      for(let i = 0; i < sessionInfos.length; i++)
      {
            let dateStart = parseDate(sessionInfos[i].date_start).finalDate;
            let dateEnd = parseDate(sessionInfos[i].date_end).finalDate;

            //Check for year
            if(year >= dateStart.split("/")[2] && year <= dateEnd.split("/")[2])
            {
                  //check month
                  if(month >= dateStart.split("/")[1] && month <= dateEnd.split("/")[1])
                  {
                        //check Day
                        if(day >= dateStart.split("/")[0] && day <= dateEnd.split("/")[0])
                        {

                              date_session.innerHTML = `du ${dateStart.split("/")[0]}/${dateStart.split("/")[1]} au ${dateEnd.split("/")[0]}/${dateEnd.split("/")[1]}`;
                              return;
                        }
                        else
                        date_session.innerHTML = " - ";
                  }
                  else
                  date_session.innerHTML = " - ";
            }
            else
            date_session.innerHTML = " - ";
      }
}


/*************************************************** HANDLE UPDATE NEW DATAS ******************************************/

function updateNewDatas(data)
{
      // console.log("data to update : ", JSON.parse(data));

      let dataArray = JSON.parse(data);

      //Update configurations
      if(dataArray.configurations.length > 0)
      {
            handleBoxInfos(dataArray.configurations);
      }

      //Update notifications/interfaces
      if(dataArray.notifications.length > 0)
      {
            for(let i = 0; i < dataArray.notifications.length; i++)
            {
                  console.log("NOTIF FORMAT => ", JSON.parse(dataArray.notifications[i].interface))


                  if(JSON.parse(dataArray.notifications[i].interface).length > 0)
                  {
                        if(dataArray.notifications[i].id_interface != null)
                        {
                              updateInterface(JSON.parse(dataArray.notifications[i].interface)[0]);
                        }
                        else
                        {
                              console.log("it's a notif : ", dataArray.notifications[i])
                        }
                  }
                  else
                  {
                        console.log('Interface vide !!!');
                  }
            }
      }
}


/*************************************************** HANDLE UPDATE INTERFACES *******************************************/
function updateInterface(data)
{
      let index = data.id;

      //update interface Array
      let isNew = true;
      for(let i = 0; i < interfacesArray.length; i++)
      {
            if(index == interfacesArray[i].id)
            {
                  interfacesArray.splice(i, 1, data);
                  update();
                  isNew = false;
            }
      }

      if(isNew)
      {
            console.log('INTERFACE NEW : ', data);
            buildInterfaceContainer(data);
      }

      // console.log('data : ', data, 'isNew : ', isNew);



      function update()
      {

            console.log('INTERFACE UPDATE : ', data);

            //Grab all 
            let currInterface = document.getElementById(`interfacebox_${index}`);
      
            let interface_date_update = document.getElementById(`interface_date_update_${index}`);
            let interface_numseq = document.getElementById(`interface_numseq_${index}`);
            let interface_datetournage = document.getElementById(`interface_datetournage_${index}`);
            let interface_description = document.getElementById(`interface_description_${index}`);
      
            currInterface.path = data.path;
      
            //Handle date format
            let updateDate = `${parseDate(data.updated_at).finalDate} - ${parseDate(data.updated_at).finalTime}`;
      
            //Get date_tournage
            let date_tournage = `${parseDate(data.date_tournage).finalDate}`;
            currInterface.date_tournage = date_tournage;
      
            //Update all
            interface_date_update.innerText = updateDate;
            interface_numseq.innerText = data.num_seq;
            interface_datetournage.innerText = date_tournage;
            interface_description.innerText = data.title;
      }
}





/**************************************************************************************************************************************************************************/
/******************************************************************************* HANDLE ALL INTERACTIONS *****************************************************************/

/**************************************** HANDLE RESIZE ALL RESULT CONTAINER *************************/
function resizeAllResultContainer()
{
      const maincontent_category_btn_container = document.getElementById('maincontent_category_btn_container');
      const main_header_container = document.getElementById('main_header_container');
      const header = document.querySelector('header');

      let maincontentCategoryBtnContainerHeight = maincontent_category_btn_container.getBoundingClientRect().height;
      let mainHeaderContainerHeight = main_header_container.getBoundingClientRect().height;
      let headerHeight = header.getBoundingClientRect().height;

      let finalHeight = window.innerHeight - (headerHeight + mainHeaderContainerHeight + maincontentCategoryBtnContainerHeight);
      maincontent_allresult_container.style.height = `${finalHeight}px`;
}



/**************************************** HANDLE CHANGE CATEGORY *************************************/
const change_daytosession_btn = document.getElementById('change_daytosession_btn');

function handleChangeCategory(event, type)
{
      if(event.target.id == "change_daytosession_btn" || event.target.classList.contains('arrow_btn'))
      return;

      if(type == "specific")
      {
            maincontent_allresult_innercontainer.innerHTML = "";
            main_content_container.style.background = "var(--generic-color)";
            maincontent_genericbox.children[0].style.opacity = "0";
            maincontent_genericbox.children[1].style.color = "white";
            maincontent_sessionbox.children[0].style.opacity = "1";
            maincontent_sessionbox.children[1].style.color = "black";
            maincontent_sessionbox.children[2].src = "/assets/chevron_left_icon.svg";
            maincontent_sessionbox.children[3].src = "/assets/chevron_right_icon.svg";
            maincontent_allresult_container.style.borderRadius = "0 1.2rem 0 0";
            maincontent_allresult_innercontainer.style.flexWrap = "nowrap";
            maincontent_allresult_innercontainer.style.flexDirection = "column";
            maincontent_allresult_innercontainer.style.justifyContent = "flex-start";


            for(let i = 0; i < interfacesArray.length; i++)
            {
                  buildInterfaceContainer(interfacesArray[i]);
            }

            if(maincontent_sessionbox_infos.classList.contains('is_day'))
            {
                  let currDate = currentDate();
                  handleSortResult(searchbar_input.value, currDate)
            }

            setTimeout(() => {
                  change_daytosession_btn.style.pointerEvents = "all";
            }, 200);
      }
      else
      {
            maincontent_allresult_innercontainer.innerHTML = "";
            main_content_container.style.background = "var(--specific-color)";
            maincontent_genericbox.children[0].style.opacity = "1";
            maincontent_genericbox.children[1].style.color = "black";
            maincontent_sessionbox.children[0].style.opacity = "0";
            maincontent_sessionbox.children[1].style.color = "white";
            maincontent_sessionbox.children[2].src = "/assets/chevron_left_icon_black.svg";
            maincontent_sessionbox.children[3].src = "/assets/chevron_right_icon_black.svg";
            maincontent_allresult_container.style.borderRadius = "1.2rem 0 0 0";
            maincontent_allresult_innercontainer.style.flexWrap = "wrap";
            maincontent_allresult_innercontainer.style.flexDirection = "row";
            maincontent_allresult_innercontainer.style.justifyContent = "center";

            change_daytosession_btn.style.pointerEvents = "none";

            for(let i = 0; i < categoriesArray.length; i++)
            {
                  buildGenericCategories(categoriesArray[i]);

                  if(i >= categoriesArray.length-1)
                  {
                        let paddingBox = document.createElement('div')
                        paddingBox.style.height = "2rem";
                        paddingBox.style.width = "100%";

                        maincontent_allresult_innercontainer.appendChild(paddingBox);
                  }
            }
      }
}

/*********************************************** HANDLE CHANGE SESSION TO DAY *******************************/
const maincontent_sessionbox_infos = document.getElementById('maincontent_sessionbox_infos');

function handleChangeSessionDay()
{
      let currDate = currentDate();

      if(maincontent_sessionbox_infos.classList.contains('is_day'))
      {
            maincontent_sessionbox_infos.children[0].innerHTML = "session";
            // maincontent_sessionbox_infos.children[1].innerHTML = "du 05/09 au 16/09";
            handleSession(sessionArray);
            maincontent_sessionbox_infos.classList.remove("is_day");
      }
      else
      {
            maincontent_sessionbox_infos.children[0].innerText = "day";
            maincontent_sessionbox_infos.children[1].innerText = currDate;
            maincontent_sessionbox_infos.classList.add('is_day');
            dayCounter = 0;
      }

      handleSortResult(searchbar_input.value, currDate);
}


/*********************************************** HANDLE CHANGE NEXT/PREV DAY **************************************/
let dayCounter = 0;
function handleChangeNextPrevDay(direction)
{
      let isDate = false;
      if(maincontent_sessionbox_infos.classList.contains('is_day'))
            isDate = true;

      if(isDate)
      {
            if(direction == "prev")
            {
                  dayCounter--;
            }
            if(direction == "next")
            {
                  dayCounter++;
            }

            let currDate = currentDate(dayCounter);
            handleSortResult(searchbar_input.value, currDate);
            maincontent_sessionbox_infos.children[1].innerText = currDate;
      }
}



/*********************************************** HANDLE SEARCHBAR INPUT ***********************************/
function handleSearchbar()
{
      let currDate = currentDate();
      handleSortResult(this.value, currDate);
}

function handleSortResult(input, currDate)
{
      let sortByDate = false;
      if(maincontent_sessionbox_infos.classList.contains('is_day'))
            sortByDate = true;

      for(let i = 0; i < interfacesArray.length; i++)
      {
            let el = interfacesArray[i];
            let box = document.getElementById(`interfacebox_${el.id}`);

            //Handle Parse date
            let isoDateTournage = el.date_tournage;
            let date_tournage = `${parseDate(isoDateTournage).finalDate}`;

            if(el.title.toLowerCase().includes(input.toLowerCase()))
            {
                  box.style.display = "flex";


                  if(sortByDate)
                  {
                        date_tournage == currDate ? box.style.display == "flex" : box.style.display = "none";
                  }
                  else
                  {
                        box.style.display = "flex";
                  }
            }
            else
            {
                  box.style.display = "none";
            }
      }
}

/*********************************************** HANDLE NOTIFICATIONS ****************************************/
const notif_container = document.getElementById('notif_container');
const notif_innercontainer = document.getElementById('notif_innercontainer');
const all_notifbox_container = document.getElementById('all_notifbox_container');
const notifbox_number = document.getElementById('notifbox_number');

async function handleNotifNumber(number)
{
      //HANDLE NUMBER
      if(number > 9)
      notifbox_number.children[0].style.fontSize = "1.4rem";
      if(number > 99)
            notifbox_number.children[0].style.fontSize = "1.2rem";

      notifbox_number.children[0].innerText =  number;
}

function openNotifContainer()
{
      for(let i = 0; i < notificationArray.length; i++)
      {
            let notif = notificationArray[i];
            addNotifications(notif);
      }
      notif_container.style.pointerEvents = "all";
      notif_container.style.transition = ".3s";
      notif_container.style.opacity = "1";
      setTimeout(() => {
            notif_innercontainer.style.transition = ".4s cubic-bezier(.14,.73,.02,.99)";
            notif_innercontainer.style.transform = "translate(0%, 0%)";
            notif_innercontainer.style.opacity = "1";
      }, 200);

      // handleNotifSeen();
}

async function closeNotifContainer()
{
      notif_innercontainer.style.transition = ".6s cubic-bezier(.14,.73,.02,.99)";
      notif_innercontainer.style.transform = "translate(100%, 0%)";
      notif_innercontainer.style.opacity = "0";
      setTimeout(() => {
            notif_container.style.transition = ".5s";
            notif_container.style.opacity = "0";

            setTimeout(() => {
                  notif_container.style.pointerEvents = "none";
                  all_notifbox_container.innerHTML = "";
            }, 500);
      }, 200);



      //THIS IS NOT THE FINAL SOLUTION
      // try 
      // {
      //       const response = await fetch("/api/getAllDatas", 
      //       {
      //             method: "GET",
      //       });
      //       const result = await response.text();
      //       allDatasArray = [];
      //       allDatasArray = JSON.parse(result);
      //       notificationArray = allDatasArray.notifications;

      //       let notifUnseenNumb = 0;
      //       for(let i = 0; i < notificationArray.length; i++)
      //       {
      //             if(notificationArray[i].seen == 0)
      //             notifUnseenNumb++;
      //       }
      //       handleNotifNumber(notifUnseenNumb);

      // } 
      // catch (error)
      // {
      //       console.error("Error:", error);
      // }
}

function addNotifications(notif)
{
      // allNotifications
      let newNotifBox = document.createElement('div');
      newNotifBox.setAttribute('class', "notif_box");
      
      newNotifBox.innerHTML = `
            <p class="notif_date">${parseDate(notif.created_at).finalDate} à ${parseDate(notif.created_at).finalTime}</p>
            <p class="notif_description">${notif.message}</p>
      `;
      all_notifbox_container.appendChild(newNotifBox);
}

function handleNotifSeen()
{
      fetch("/api/notification/unseen", 
      {
            method: 'PUT', 
            headers: {
              'Content-Type': 'application/json',
            },
      })
      .then(res => res.json())
      .then(data => {
            console.log("notif : ",data)
      })
      .catch(err => console.log('error notif seen : ', err));
}




/***********************************************************************************************************************************************************/
/************************************************************************* SOCKET CONNECTION **************************************************************/

let configurationMessage = null;
let notificationsMessage = null;
let saveLastMsg = {configurations: configurationMessage, notifications: notificationsMessage};




function startSocket()
{
      const socket = io.connect('http://localhost:3000');
      socket.on('connect', function() {
            console.log('Connected to the server');
            socket.emit('client_connected', JSON.stringify(saveLastMsg));
      });
      
      socket.on('newData', function(msg){
      
            console.log('Message from server: ', JSON.parse(msg));
      
            //Handle if msg is notifications or configuration
            if(typeof JSON.parse(msg).notifications != "undefined")
            {      
                  if(JSON.parse(msg).notifications.length > 0)
                  notificationsMessage = JSON.parse(msg).notifications[0].id;
            }
            else
                  configurationMessage = JSON.parse(msg).configurations;
      
      
            //Save configuration and notifications message
            saveLastMsg = {configurations: configurationMessage, notifications: notificationsMessage};      
      
            //Update the DOM
            updateNewDatas(msg);
      
            // Emit a response back to the server
            socket.emit('client_get_msg', 'Hi, i got your message' + JSON.stringify(saveLastMsg));
      });
}




/********************************************************************************************************************************************************/
/************************************************************************ USEFULL FUNCTIONS ************************************************************/
function parseDate(isoDate)
{
      let date = new Date(isoDate);
      let day= String(date.getDate()).padStart(2, '0');
      let month = String(date.getMonth()+1).padStart(2,"0");
      let year = date.getFullYear();
      let hours = String(date.getHours()).padStart(2, '0');
      let minutes = String(date.getMinutes()).padStart(2, '0');
      let finalDate = `${day}/${month}/${year}`;
      let finalTime = `${hours}h${minutes}`;
      let result = {finalDate, finalTime};
      return result;
}

function currentDate(counter)
{
      if(typeof counter == "undefined")
      counter = 0;

      const date = new Date();
      date.setDate(date.getDate() + counter);
      let currentDay= String(date.getDate()).padStart(2, '0');
      let currentMonth = String(date.getMonth()+1).padStart(2,"0");
      let currentYear = date.getFullYear();
      let currDate = `${currentDay}/${currentMonth}/${currentYear}`;

      return currDate;
}




/*********************************************** INIT ALL *************************************************/
async function initAll()
{
      

      //All DATAS
      await getAllData();
      // await getCheckNews();
      handleSession(sessionArray);
      handleBoxInfos(configArray)


      searchbar_input.addEventListener('input', handleSearchbar);
      resizeAllResultContainer();

}





window.addEventListener('load', initAll);

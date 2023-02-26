
## Orders system
### FrontEnd - Angular
#### Pages
* Login - Login form that send the username and password to the server using `Login(LoginFormObj)`
, then navigate to Users page.
* Users - Two tabs that presenting users or admins by using `GetUsersByRole(RoleId)`. Clicking on user's id navigate to user page.
* User - Presenting all user information, total amount of orders and orders list using `GetOrders(userId)` that can be fillterd and return total sum by selecting "From" and "To" dates using `GetOrdersSum(OrdersSumObj)`

All pages have Nav-menu at the top with users page, logged user's full name and logout button
- - - -
### BackEnd - ASP.Net

*LoginFormObj - object that include username and password*

*OrdersSumObj - object that include userId, From and To*
 #### Methods
 * Login(LoginFormObj)
    * Input - User name and password
    * Output -  Token and Logged user entity
 * GetUsersByRole(roleId)
    * Input - roleId
    * Output -  List of users with specific roleId
 * GetOrders(userId)
    * Input - userId
    * Output -  List of orders of specific userId
 * GetOrdersSum(LoginFormObj)
    * Input - userId, "From" date and "To" date
    * Output -  sum of total prices
- - - -
### SQL - MS SQL Server
#### Database Diagram that present the tables and relations

<a href="https://ibb.co/Ypj52F2"><img src="https://i.ibb.co/2gKzq1q/DB.png" alt="DB" border="0"></a>
- - - -
### Screenshots and video
[![Orders system](https://img.youtube.com/vi/KFcxtcoJquo/0.jpg)](https://www.youtube.com/watch?v=KFcxtcoJquo)
<a href="https://ibb.co/0h952Pp"><img src="https://i.ibb.co/Tm0y2zD/login.png" alt="login" border="0" style="width:33%"></a>
<a href="https://ibb.co/fxG8fRL"><img src="https://i.ibb.co/JsFxVLg/user.png" alt="user" border="0" style="width:33%"></a>
<a href="https://ibb.co/YDd7SKG"><img src="https://i.ibb.co/9w490fj/userlist.png" alt="userlist" border="0" style="width:33%"></a>



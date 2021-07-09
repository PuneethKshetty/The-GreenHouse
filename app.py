from flask import Flask,render_template,redirect,url_for,flash,session
from flask import request, make_response
import mysql.connector as mysql

app = Flask(__name__)

mydb = mysql.connect(host="localhost",user="root",passwd="",database="greenhouse")

app.secret_key = "green-house"

app.config['PROPAGATE_EXCEPTIONS'] = True
 
@app.route("/")
def home():
    return render_template("index.html")

@app.route('/inner/')
def inner():
      return render_template('Users/inner.html')

@app.route('/adminreg', methods = ['GET','POST'])
def adminreg():
    if request.method == 'GET':
        return render_template('admin/adminreg.html')
    if request.method=='POST':
        d_name=request.form.get("D_name")
        d_email=request.form.get("D_email")
        d_password=request.form.get("D_password")
        d_address=request.form.get("D_address")
        cur=mydb.cursor()
        cur.execute("insert into distributors(D_name,D_email,D_password,D_address) values(%s,%s,%s,%s)",(d_name,d_email,d_password,d_address))
        mydb.commit()
        cur.close()
    return render_template('admin/adminlog.html')

@app.route('/adminlog',methods=['GET','POST'])
def adminlogin():
    if request.method == 'GET':
          return render_template('admin/adminlog.html')
    if request.method == 'POST':
          return render_template('admin/addproduct.html')


@app.route('/addproduct', methods=['GET','POST'])
def addproduct():
    if request.method == 'GET':
        return render_template('admin/addproduct.html')
    if request.method == 'POST':
       return render_template('admin/addproduct.html')

@app.route('/register', methods=['GET','POST'])
def registerin():
    if request.method == 'GET':
        return render_template('Users/register.html')
    if request.method=='POST':
        email=request.form.get("U_email")
        name=request.form.get("U_name")
        password=request.form.get("U_password")
        phone=request.form.get("U_phone")
        cur=mydb.cursor()
        cur.execute("insert into users(U_name,U_email,U_password,U_phone) values(%s,%s,%s,%s)",(name,email,password,phone))
        mydb.commit()
        cur.close()
    return render_template('Users/login.html')

@app.route('/login', methods = ['GET','POST','DELETE'])
def loginin():
    if request.method == 'GET':
        return render_template('Users/login.html')
    if request.method == 'POST':
        return render_template('Users/inner.html')

@app.route("/about/")
def about():
  return render_template("Users/about.html")

@app.route('/contact',methods = ['GET','POST'])
def contactus():
    if request.method == 'GET':
        return render_template('Users/contact.html')
    if request.method == 'POST':
        email = request.form.get("cemail")
        name = request.form.get("cname")
        message = request.form.get("cmessage")
        cur = mydb.cursor()
        cur.execute("insert into contact(cemail,cname,cmessage) values(%s,%s,%s)",
                    (email,name,message))
        mydb.commit()
        cur.close()
        return render_template('Users/inner.html')

@app.route('/billing',methods=['GET','POST'])
def billing():
    if request.method == 'GET':
        return render_template('Users/billing.html')
    if request.method=='POST':
        name=request.form.get("B_name")
        email=request.form.get("B_email")
        address=request.form.get("B_address")
        city = request.form.get("B_city")
        state = request.form.get("B_state")
        zip = request.form.get("B_zip")
        cur= mydb.cursor()
        cur.execute("insert into shipment(B_name,B_email,B_address,B_city,B_state,B_zip) values(%s,%s,%s,%s,%s,%s)",(name,email,address,city,state,zip))
        mydb.commit()
        cur.close()
    return render_template('Users/payment.html')

@app.route('/payment',methods=['GET','POST'])
def payment():
    if request.method == 'GET':
        return render_template('Users/payment.html')
    if request.method=='POST':
        name=request.form.get("PP_name")
        number=request.form.get("PP_credit")
        expmonth=request.form.get("PP_ExpMonth")
        CVV = request.form.get("PP_CVV")
        expyear = request.form.get("PP_ExpYear")
        cur=mydb.cursor()
        cur.execute("insert into payment(PP_name,PP_credit,PP_ExpMonth,PP_CVV,PP_ExpYear) values(%s,%s,%s,%s,%s)",(name,number,expmonth,CVV,expyear))
        pay = cur.fetchall()
        mydb.commit()
        cur.close()
    return render_template('Users/inner.html')

@app.route('/OP',methods=['GET','POST'])
def OP():
    if request.method == 'GET':
        return render_template('Users/Category/OP.html')
    if request.method == 'POST':
        name = request.form.get("P_name")
        price = request.form.get("P_price")
        qty = request.form.get("P_qty")
        color = request.form.get("P_color")
        cur = mydb.cursor()
        print(name, int(price), qty, color)
        cur.execute("insert into product(P_name,P_price,P_qty,P_color) values(%s,%s,%s,%s)", (name, price, qty, color))
        cur.execute("select p_id,p_name,p_price,p_qty,p_color from product order by p_id desc limit 1")
        data = cur.fetchall()
        print(data[0][0])
        print(data)
        mydb.commit()
        cur.close()
        return render_template('Users/AddCart.html', data=data,id=data[0][0])

@app.route('/HP',methods=['GET','POST'])
def HP():
    if request.method == 'GET':
        return render_template('Users/Category/HP.html')
    if request.method == 'POST':
        name=request.form.get("P_name")
        price=request.form.get("P_price")
        qty=request.form.get("P_qty")
        color = request.form.get("P_color")
        cur=mydb.cursor()
        print(name,int(price),qty,color)
        cur.execute("insert into product(P_name,P_price,P_qty,P_color) values(%s,%s,%s,%s)",(name,price,qty,color))
        cur.execute("select p_id,p_name,p_price,p_qty,p_color from product order by p_id desc limit 1")
        data=cur.fetchall()
        print(data)
        mydb.commit()
        cur.close()
    return render_template('Users/AddCart.html',data=data,id=data[0][0])

@app.route('/GP',methods=['GET','POST'])
def GP():
    if request.method == 'GET':
       return render_template('Users/Category/GP.html')
    if request.method == 'POST':
       name = request.form.get("P_name")
       price = request.form.get("P_price")
       qty = request.form.get("P_qty")
       color = request.form.get("P_color")
       cur = mydb.cursor()
       print(name, int(price), qty, color)
       cur.execute("insert into product(P_name,P_price,P_qty,P_color) values(%s,%s,%s,%s)", (name, price, qty, color))
       cur.execute("select p_id,p_name,p_price,p_qty,p_color from product order by p_id desc limit 1")
       data = cur.fetchall()
       print(data)
       mydb.commit()
       cur.close()
       return render_template('Users/AddCart.html', data=data,id=data[0][0])

@app.route('/Bonsais',methods=['GET','POST'])
def Bonsais():
    if request.method == 'GET':
        return render_template('Users/Category/Bonsais.html')
    if request.method == 'POST':
        name = request.form.get("P_name")
        price = request.form.get("P_price")
        qty = request.form.get("P_qty")
        color = request.form.get("P_color")
        cur = mydb.cursor()
        #print(name, int(price), qty, color)
        cur.execute("insert into product(P_name,P_price,P_qty,P_color) values(%s,%s,%s,%s)", (name, price, qty, color))
        cur.execute("select p_id,p_name,p_price,p_qty,p_color from product order by p_id desc limit 1")
        data = cur.fetchall()
        #print(data)
        #print(data)
        mydb.commit()
        cur.close()
        return render_template('Users/AddCart.html', data=data,id=data[0][0])

@app.route('/Orchids',methods=['GET','POST'])
def Orchids():
    if request.method == 'GET':
        return render_template('Users/Category/Orchids.html')
    if request.method == 'POST':
        name = request.form.get("P_name")
        price = request.form.get("P_price")
        qty = request.form.get("P_qty")
        color = request.form.get("P_color")
        cur = mydb.cursor()
        print(name, int(price), qty, color)
        cur.execute("insert into product(P_name,P_price,P_qty,P_color) values(%s,%s,%s,%s)", (name, price, qty, color))
        cur.execute("select p_id,p_name,p_price,p_qty,p_color from product order by p_id desc limit 1")
        data = cur.fetchall()
        print(data)
        mydb.commit()
        cur.close()
        return render_template('Users/AddCart.html', data=data,id=data[0][0])

@app.route("/AddCart/<id>",methods=['GET','POST'])
def AddCart(id):
    if (request.method == 'GET'):
        return render_template('Users/AddCart.html')
    if (request.method == 'POST'):
        cur = mydb.cursor()

        # Get all details
        cur.execute("select P_id,P_name,P_price,P_qty,P_color from product where HP.P_id=%s",[id])
        HP = cur.fetchall()
        cur.execute("select P_id,P_name,P_price,P_qty,P_color from product where OP.P_id=%s",[id])
        OP = cur.fetchall()
        cur.execute("select P_id,P_name,P_price,P_qty,P_color from product where GP.P_id=%s",[id])
        GP = cur.fetchall()
        cur.execute("select P_id,P_name,P_price,P_qty,P_color from product where Bonsais.P_id=%s",[id])
        Bonsais = cur.fetchall()
        cur.execute("select P_id,P_name,P_price,P_qty,P_color from product where Orchids.P_id=%s",[id])
        Orchids = cur.fetchall()
        mydb.commit()
        cur.close()
        return render_template("Users/AddCart.html",id=id,HP=HP,OP=OP,GP=GP,Bonsais=Bonsais,Orchids=Orchids)
    else:
        return render_template("inner.html")


@app.route("/delete/<id>", methods=['GET'])
def delete(id):
    cur = mydb.cursor()
    cur.execute("Delete from product where P_id=%s", [id])
    mydb.commit()
    cur.close()
    return render_template("Users/AddCart.html",id=id)

@app.route("/AddDetails/<id>",methods=['GET','POST'])
def AddDetails(id):
    if request.method == 'GET':
        return render_template("Users/AddDetails.html")
    if request.method == 'POST':
        Pname = request.form.get('P_name')
        Pprice = request.form.get('P_price')
        Pqty = request.form.get('P_qty')
        Pcolor = request.form.get('P_color')
        cur = mydb.cursor()
        cur.execute("UPDATE product SET P_name=%s, P_price=%s,P_qty=%s,P_color=%s WHERE P_id=%s",
                    (Pname, Pprice, Pqty, Pcolor, id))
        cur.execute("select P_id,P_name,P_price,P_qty,P_color from product where P_id=%s", [id])
        data = cur.fetchall()
        mydb.commit()
        cur.close()
        return render_template("Users/AddCart.html",data=data,id=id)

@app.route("/update/<id>", methods=['GET','POST'])
def update(id):
    if request.method =='GET':
        print(id)
        return render_template("Users/AddDetails.html",id=id)

    if request.method == 'POST':
        return render_template("Users/AddCart.html",id=id)
        # return redirect(request.url)


if __name__ == "__main__":
    app.run(debug=True)
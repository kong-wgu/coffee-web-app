'use client'
import React, { useEffect, useState, useRef } from "react";
import CoffeeSlider from "../components/CoffeeSlider";
import SalesChart from "../components/SalesChart";
import HourlySalesChart from "../components/HourlySalesChart";
import Clock from "../components/Clock";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { updateData } from "@/api/data";


let COFFEE_TYPES = [
  {coffee_name: "Americano", hour_of_day: 0, sales: 0 , time: ""},
  {coffee_name: "Americano with Milk", hour_of_day: 0, sales: 0 , time: ""},
  {coffee_name: "Cappuccino", hour_of_day: 0, sales: 0 , time: ""},
  {coffee_name: "Cocoa", hour_of_day: 0, sales: 0 , time: ""},
  {coffee_name: "Cortado", hour_of_day: 0, sales: 0 , time: ""},
  {coffee_name: "Expresso", hour_of_day: 0, sales: 0 , time: ""},
  {coffee_name: "Hot Chocolate", hour_of_day: 0, sales: 0 , time: ""},
  {coffee_name: "Latte", hour_of_day: 0, sales: 0 , time: ""},
];

let CoffeeHours = [
  {hour: 8, totalSales: 0},
  {hour: 9, totalSales: 0},
  {hour: 10, totalSales: 0},
  {hour: 11, totalSales: 0},
  {hour: 12, totalSales: 0},
  {hour: 13, totalSales: 0},
  {hour: 14, totalSales: 0},
  {hour: 15, totalSales: 0},
  {hour: 16, totalSales: 0},
]

const HOURS = Array.from({ length: 10 }, (_, i) => i + 8); // 8 AM to 5 PM

export type coffee = {
  hour_of_day: number, 
  time: string,
  coffee_name: string, 
  sales: number
}

type hourly = {
  hour : number, 
  totalSales : number
}

export function Info() {
  const [currentTime, setCurrentTime] = useState("08:00");
  const [currentHour, setCurrentHour] = useState(8)
  let coffeeData = useRef<coffee[]>(COFFEE_TYPES)
  const [predictionCoffee, setPredictionCoffee] = useState<coffee[]>(COFFEE_TYPES)
  const [unpredictedCoffee, setUnpredictedCoffee] = useState<coffee[]>(COFFEE_TYPES)

  const [dataAPI, setDataAPI] = useState<coffee[]>(COFFEE_TYPES)
  const [hourlyData, setHourlyData] = useState<hourly[]>(CoffeeHours)

  const [loading, setLoading] = useState(false)
  const [listingLoading, setListingLoading] = useState(false)

  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    
    const getCoffee = async() => {
      return await fetch('https://c964.ngrok.dev/machinelearning').then((dat) => {
        dat.json().then((what) => {
          console.log(what)
          coffeeData.current = what;

          let newData : coffee[] = [];
          coffeeData.current.map((coffee : coffee) => {
            newData.push(coffee)
          })

          console.log(newData)
          
          let init = coffeeData.current.filter((what) => what.hour_of_day == 8)

          let newCoffeeHolder = CoffeeHours;

          coffeeData.current.map((what) => {
            let found = newCoffeeHolder.findIndex((num) => num.hour == what.hour_of_day)
            if(found != -1){
              let hold = newCoffeeHolder?.at(found)?.totalSales!;
              hold = hold + what.sales;
              newCoffeeHolder[found].totalSales = hold;
            }
          })

          setHourlyData(newCoffeeHolder)

          let unpredicted = dataAPI.filter((what) => init.findIndex((item) => item.coffee_name == what.coffee_name) == -1 )
          console.log(unpredicted)
          setUnpredictedCoffee(unpredicted)

          setPredictionCoffee(init)
          setSalesData(newData)

          setLoading(true)
          setPageLoading(false)
        })
      })

    }
    
    getCoffee()
  }, [])

  const [salesData, setSalesData] = useState<coffee[]>();

  const [adjustedData, setAdjustedData] = useState<coffee[]>(COFFEE_TYPES)

  // Initialize hourly sales data with all hours
  const [hourlySalesHistory, setHourlySalesHistory] = useState(
    HOURS.reduce((acc, hour) => {
      const formattedHour = `${hour.toString().padStart(2, '0')}:00`;
      acc[formattedHour] = COFFEE_TYPES.reduce((coffeeAcc, coffe) => ({
        ...coffeeAcc,
        [coffe.sales]: 50
      }), {});
      return acc;
    }, {} as Record<string, Record<string, number>>)
  );

  const handleSliderChange = (name: string) => (values: number[]) => {
    const newSales = values[0];
    const coffeeType = dataAPI.findIndex((what) => what.coffee_name == name);
    const coffeeIndex = unpredictedCoffee.findIndex((what) => what.coffee_name == name);
    
    if(coffeeType != -1 ){
      
      unpredictedCoffee.at(coffeeIndex)!.sales = newSales
      setUnpredictedCoffee((prev) => 
        prev.map((item, index) => ({
          ...item,
          sales: index == coffeeIndex ? newSales : item.sales,
        }))
      )

      console.log(dataAPI.at(coffeeType)!.coffee_name)

      setDataAPI((prev) => 
        prev.map((item, index) => ({
          ...item,
          sales : index == coffeeType ? newSales : item.sales
        }))
      )
    }
  };

  const handlePredictionSliderChange = (name: string) => (values: number[]) => {
    const newSales = values[0];
    const coffeeType = dataAPI.findIndex((what) => what.coffee_name == name);
    const coffeeIndex = unpredictedCoffee.findIndex((what) => what.coffee_name == name);

    if(coffeeType != -1 ){      
      let indexes = 0;
      salesData!.map((what, index) => {
        if(what.hour_of_day == hour && what.coffee_name == name){
          indexes = index
        }      
      })

      setDataAPI((prev) => 
        prev.map((item, index) => ({
          ...item,
          sales : index == coffeeType ? newSales : item.sales
        }))
      )
      salesData!.at(indexes)!.sales = newSales;
    }
  };

  const handleListingReset = async() => {
    
    setListingLoading(true);
    setUnpredictedCoffee((prev) => 
      prev.map((item, index) => ({
        ...item,
        sales: 0,
      }))
    )

    setPageLoading(true)
    setLoading(false)

    await fetch('https://c964.ngrok.dev/reset').then(async(dat) => {
      console.log(dat)
        await fetch('https://c964.ngrok.dev/machinelearning').then((dat) => {
          dat.json().then((what) => {
            coffeeData.current = what;
            let newData : coffee[] = [];
            coffeeData.current.map((coffee : coffee) => {
              newData.push(coffee)
            })
      
            let init = coffeeData.current.filter((what) => what.hour_of_day == currentHour)
      
            let newCoffeeHolder = [
              {hour: 8, totalSales: 0},
              {hour: 9, totalSales: 0},
              {hour: 10, totalSales: 0},
              {hour: 11, totalSales: 0},
              {hour: 12, totalSales: 0},
              {hour: 13, totalSales: 0},
              {hour: 14, totalSales: 0},
              {hour: 15, totalSales: 0},
              {hour: 16, totalSales: 0},
            ]

            coffeeData.current.map((what) => {
              let found = newCoffeeHolder.findIndex((num) => num.hour == what.hour_of_day)
              if(found != -1){
                let hold = newCoffeeHolder.at(found)!.totalSales;
                hold = hold + what.sales;
                newCoffeeHolder.at(found)!.totalSales = hold;
              }
            })

            console.log(coffeeData.current)

            console.log(newCoffeeHolder)
      
            setHourlyData(newCoffeeHolder)
      
            let unpredicted = dataAPI.filter((what) => init.findIndex((item) => item.coffee_name == what.coffee_name) == -1 )
            setUnpredictedCoffee(unpredicted)
      
            setPredictionCoffee(init)
            setSalesData(newData)

            setDataAPI(COFFEE_TYPES)
      
            setLoading(true)
            setPageLoading(false)
            setListingLoading(false)
          })
        })
 
    })
   
  }
  

  const [hour, setHour] = useState(8)

  const handleTimeChange = (newTime: string) => {
    setCurrentTime(newTime);
    let currentHour = 0;
    if(newTime.at(0) == "0"){
      setHour(Number(newTime.at(1)))
      currentHour = Number(newTime.at(1))
    }else if(newTime.at(0) == "1"){
      let h = newTime.substring(0, 2)
      console.log(h)
      setHour(Number(h))
      currentHour = Number(h)

      setCurrentHour(currentHour)
    }

    let filter = coffeeData.current.filter((what) => what.hour_of_day == currentHour)
    setPredictionCoffee(filter);
    
    let unpredicted = dataAPI.filter((what) => filter.findIndex((item) => item.coffee_name == what.coffee_name) == -1 )

    console.log(unpredicted)
    setUnpredictedCoffee(unpredicted)

    setSalesData((prev) =>
      prev!.map((item) => ({
        ...item,
        sales: item.sales,
        time: newTime,
      }))
    );
  };

  const formatDisplayTime = (time: string) => {
    const [hours] = time.split(':');
    const hour = parseInt(hours, 10);
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const ampm = hour < 12 ? 'AM' : 'PM';
    return `${displayHour}:00 ${ampm}`;
  };

  const hourlySalesData = HOURS.map(hour => {
    const formattedHour = `${hour.toString().padStart(2, '0')}:00`;
    const hourData = hourlySalesHistory[formattedHour];
    const totalSales = hourData ? Object.values(hourData).reduce((sum, sales) => sum + sales, 0) : 0;

    return {
      hour: formatDisplayTime(formattedHour),
      totalSales: totalSales
    };
  });

  const handleUpdate = async() => {

    let newHour = currentTime.slice(0, 2)


    console.log(newHour)
    let convertHour = Number(newHour)
    let newTime = currentTime.slice(0, 3)

    if(newTime == "08:" || newTime == "09:"){
      newTime = newTime.slice(1,3)
    }
    newTime = newTime + "30"

    let today = new Date().toLocaleDateString()
    let splitter = today.split('/')
    console.log(splitter)
    let newYear = splitter[2]
    newYear = newYear.slice(2,4)
    console.log(newYear)
    today = splitter[0] + "/" + splitter[1] + "/" + newYear;

    newTime = today + " " + newTime;

    console.log(newTime)
   
    dataAPI.map((prev) => {
      prev.time = newTime
      prev.hour_of_day = convertHour
    })

    
    console.log(dataAPI)
    
    setPageLoading(true)
    setLoading(false)
    
    await updateData(dataAPI).then((what) => {

      console.log(what)

      let start = async() => {
        await fetch('https://c964.ngrok.dev/machinelearning').then((dat) => {
          dat.json().then((what) => {
            coffeeData.current = what;
            let newData : coffee[] = [];
            coffeeData.current.map((coffee : coffee) => {
              newData.push(coffee)
            })
      
            let init = coffeeData.current.filter((what) => what.hour_of_day == currentHour)
      
            let newCoffeeHolder = [
              {hour: 8, totalSales: 0},
              {hour: 9, totalSales: 0},
              {hour: 10, totalSales: 0},
              {hour: 11, totalSales: 0},
              {hour: 12, totalSales: 0},
              {hour: 13, totalSales: 0},
              {hour: 14, totalSales: 0},
              {hour: 15, totalSales: 0},
              {hour: 16, totalSales: 0},
            ]

            coffeeData.current.map((what) => {
              let found = newCoffeeHolder.findIndex((num) => num.hour == what.hour_of_day)
              if(found != -1){
                let hold = newCoffeeHolder.at(found)!.totalSales;
                hold = hold + what.sales;
                newCoffeeHolder.at(found)!.totalSales = hold;
              }
            })          
      
            setHourlyData(newCoffeeHolder)
      
            let unpredicted = dataAPI.filter((what) => init.findIndex((item) => item.coffee_name == what.coffee_name) == -1 )
            console.log(unpredicted)
            setUnpredictedCoffee(unpredicted)
      
            setPredictionCoffee(init)
            setSalesData(newData)
      
            setLoading(true)
            setPageLoading(false)
          })
        })
      }

      start()
      
    })
      
    
  }



  return (
    <div className="min-h-screen bg-gradient-to-b from-coffee-light/20 to-white">
      <div className="container py-8 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-coffee-dark">Coffee Sales Dashboard</h1>
          <p className="text-coffee-medium">
            Click on the desired Hour to see the top 3 selling coffees for that hour!
          </p>
        </div>

        {pageLoading ? (
          <div className="flex place-content-center">
            <svg className="inline-block h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : (
          <>
            <div className="flex justify-center">
              <Clock value={currentTime} onChange={handleTimeChange} />
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6 bg-white p-6 rounded-lg shadow-md">
                {loading ? (

                  <>
                  <div className="font-bold"> Prediction coffee </div>
                  {coffeeData.current.map((coffee, index) => (
                    <div key={index}>
                      
                      {coffee.hour_of_day == hour ? (
                        <CoffeeSlider
                          key={coffee.coffee_name}
                          label={`${coffee.coffee_name} (${formatDisplayTime(currentTime)})`}
                          value={salesData![index]!.sales}
                          showSlider={false}
                          showGreen={false}
                          onChange={handleSliderChange(coffee.coffee_name)}
                        />
                      ) :(
                        <></>
                      )}
                    </div>
                  ))}
                  </>
                ) : (
                  <></>
                )}

                <Separator className="bg-black" />

                <div className="flex flex-col gap-2">
                  <div className="font-bold"> Coffee Listing  </div>
                  <div className="text-sm my-2"> {"Move Sliders then press the Update Button to adjust data for a new AI prediction"} </div>
                  <Button onClick={handleUpdate}> Update for new Prediction</Button>
                  <Button onClick={handleListingReset}> Reset Data </Button>
                </div>


                <div className="font-bold"> Prediction Coffee </div>

                  {!listingLoading ? (
                    <>
                      {coffeeData.current.map((coffee, index) => (
                        <div key={index}>
                          
                          {coffee.hour_of_day == hour ? (
                            <CoffeeSlider
                              key={coffee.coffee_name}
                              label={`${coffee.coffee_name} (${formatDisplayTime(currentTime)})`}
                              value={salesData![index].sales}
                              showSlider={true}
                              showGreen={true}
                              onChange={handlePredictionSliderChange(coffee.coffee_name)}
                            />
                          ) :(
                            <></>
                          )}
                        </div>
                      ))}
        
                      <Separator className="bg-black"/>

                      <div className="font-bold"> Others  </div>
        
                      {unpredictedCoffee.map((coffee, i) => (
                        <CoffeeSlider
                          key={coffee.coffee_name}
                          label={`${coffee.coffee_name} (${formatDisplayTime(currentTime)})`}
                          value={coffee.sales}
                          showSlider={true}
                          showGreen={false}
                          onChange={handleSliderChange(coffee.coffee_name)}
                        />    
                      ))}

                    </>

                  ) : (
                    <svg className="inline-block h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}

              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-coffee-dark mb-4">
                  <div>
                    Top 3 Selling Coffees at {formatDisplayTime(currentTime)} 
                  </div>
                </h2>
                  <div>
                  {"Machine Learning Prediction"}
                  </div>
                {loading ? (
                  <>                        
                    <SalesChart data={predictionCoffee} />
                    <HourlySalesChart data={hourlyData} />                                      
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
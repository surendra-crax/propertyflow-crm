"use client"

export default function Funnel({data}:any){

  return(

    <div className="bg-white border rounded-lg p-6">

      <h2 className="font-semibold mb-4">
        Sales Funnel
      </h2>

      <div className="grid grid-cols-3 gap-4 text-center">

        <div>
          <p className="text-sm text-gray-500">
            Leads
          </p>
          <p className="text-xl font-semibold">
            {data.leads}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Site Visits
          </p>
          <p className="text-xl font-semibold">
            {data.visits}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Deals Closed
          </p>
          <p className="text-xl font-semibold">
            {data.deals}
          </p>
        </div>

      </div>

      <div className="mt-4 text-center">

        <p className="text-gray-500 text-sm">
          Conversion Rate
        </p>

        <p className="text-2xl font-semibold text-green-600">
          {data.conversionRate}%
        </p>

      </div>

    </div>

  )

}
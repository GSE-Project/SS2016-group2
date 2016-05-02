module.servive('serverData' [function(){
    
    /**
    * Returns a list of the Bus ID's
    */
    function getBusKeys():number[]{
    	
    }
    
    /**
    * Returns a list of the Line ID's
    */
    function getLineKeys():number[]{
    	
    }
    
    /**
    * Returns a list of the Stop ID's
    */
    function getStopKeys():number[]{

    }

    /**
    * Returns a copy of the Bus object for the given ID.
    */ 
    function getBus(id:number):Bus {

    }

    /**
    * Returns a copy of the Line object for the given ID
    */
    function getLine(id:number):Line{

    }

	/**
    * Returns a copy of the Route object for the given ID
    */
    function getRoute(id:number):Route{

    }

    /**
    * Returns a copy of the Stop object for the given ID
    */
    function getStop(id:number):Stop{

    }

    function getPosition(busId:number):{position:lineString, delay:number}

    /**
    * Requests an update of the persistent data
    */
    function update():void{

    }
}];
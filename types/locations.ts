interface LocationChild {
    name: string;
    api: string;
    ip: string;
    location: string;
    datacenter: string;
    bgp: boolean;
    pingtrace: boolean;
}
interface LocationGroup {
    name: string;
    locations: LocationChild[];
}
interface Config {
    locations: LocationGroup[];
}
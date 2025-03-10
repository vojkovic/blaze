/* eslint-disable @next/next/no-img-element */
import Head from 'next/head'
import { useRef, useState, Fragment, use, useEffect } from 'react'
import axios from 'axios'
import fs from 'fs'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
interface Props {
  data: Config
}
export default function Home(props: Props) {
  const [location, setLocation] = useState<string>(props.data.locations[0].locations[0].api)
  const [selectedLocation, setSelectedLocation] = useState<LocationChild>(props.data.locations[0].locations[0])
  const [type, setType] = useState<string>(`${selectedLocation.pingtrace ? 'ping' : selectedLocation.bgp ? 'bgp' : null}`)
  const [disabled, setDisabled] = useState<boolean>(false)
  const [data, setData] = useState<string>("")
  const [error, setError] = useState<string>("")
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    props.data.locations.forEach((lcl) => {
      lcl.locations.forEach((lcl) => {
        if (lcl.api === location) {
          setSelectedLocation(lcl)
          setType(`${lcl.pingtrace ? 'ping' : lcl.bgp ? 'bgp' : null}`)
          setDisabled(false)
          setData("")
          setError("")
        }
      })
    })
  }, [location, props.data.locations])
  useEffect(() => {
    console.log(selectedLocation)
  }, [selectedLocation])
  const submit = () => {
    setError("")
    setData("")
    setDisabled(true)
    axios.post(`${location}/lg`, {
      target: inputRef && inputRef.current ? inputRef.current.value : "",
      type
    }).then((res) => {
      setData(res.data.data)
    }).catch((err) => {
      try {
        setError(err.response.data.error)
      } catch (e) {
        setError(err.toString())
      }
      console.log(error)
    }).finally(() => {
      setDisabled(false)
    })
  }

  return (
    <>
      <Head>
        <title>{`AS44354 - Looking Glass`}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className='container mx-auto gap-4 px-4 2xl:px-0 flex flex-col'>
        <div className='flex md:flex-row flex-col items-center md:justify-between gap-4 w-full justify-center py-8'>
          <div className='flex flex-row gap-4 items-center'>
            <div className='h-8 w-8 flex justify-center items-center'>
              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQEAAAEACAYAAACzsMNYAAAACXBIWXMAAAsSAAALEgCl2k5qAAAQAElEQVR4nO2dvaolSxWA5xHmEc4jDPgC+wWEkxrtHQlmB4yFnRkJx1BMTqKpB4zMNhgLJxOzweCieNGRK1cUcXvW7K6h7dM/9b9WVX8LvuTO3NnV3VVf18+q6nfX6/Ud1OX4na/uXjkMPLxyHvH0yqVjnifXex7diw/az2aPqBegV6RCv3I/adifXrnCJp8mwjiJJLSfaa+oF6AHhgYvFfVxqLzajahnXo43qT4ghjyoF6BFhkb/MLypeLvrI+I9I4U41AvQAq+V6/3x9qZ/otE3gchZJH2nXXdaQL0AVhk1/GcDlRrieUEI66gXwBrH22QeDb9PnBDea9czS6gXwALH25KdTOrR1d8PMrQ7aNc9C6gXQLnxy1uf2fx98/F4G/bttnegXgClxn8aHr52BQQ7SC9QVhh2JwP1AlRs+DLRJ+NBGj9sIUOFO+06iwTyCoA3P8QgMui+Z6BeABo/GKf7YYJ6AQo1ftmMwoQf5ERkcNKu20hgu/HLuP/JQIWBfpGXS1e7HdULkFEA0vVnnR9qIXklXQwR1AuQofFLog9df9BA5psO2m1g1xI43pb8ePuDNk33CtQLENn4ZezP2x8s0WyvQL0AEQKQVF/e/mCVs3Yb6VoCx1u3S/shA2whvdRmhgfqBfBs/NL9fzHwcAF8kd7qQbvtdCGB4+0oL7r/0CoP2m2oaQkcb2v/2g8RIJUn7bbUpASOjP+hL2Q4a3KeQL0ACwIg9Rd6RERgLuVYvQCTxs8EIPSOzG+ZEoF6ARAA7BBTIlAvwCAAyf9HALA3Ttptz4QEjiwBwr5RFwECANBHVQQIAMAGT7uSwBEBAMyhIgINAcgqAId/Asxz6loCR5YBAXyoKgIEAGCTaiKoKQG+9AvgT7WEoloCYC8AQDhVRFBDAA8GbiZAqxTffVhaAPcGbiJA61yalMCRXACAnDw2JYEjKwEAJTi1JAFWAgDyU2SisIQAmAgEKEf2icLcAvhg4CYB9E7W+YGcAmAeAKAe9xYlwOnAAPWQ+YEsw4JcAjgYuCkAe+PZhASObA0G0CR5WMAwAKBtkocFqQJgNQBAnydNCbAaAGCDQ3UJHEkKArDES1UJHG+TgWwOArBF1GfQYyXAZCCAPaImCWMEcGfgYgFgnnMNCXBUGIBdpDdwV0wCR3oBAC3wVFICFwMXCADbePcG6AUA9Il3b4C5AIB+8eoN0AsA6BevlQJ6AQD94pU34CMAsgMB2uWUQwLsEQBol485JMCBIQBtc4iWwJFjwwB6YHW5kAlBgH2wOEHIhCBAh/zoe3+5/vz8t/F/W5wgXJPASftCAGCbHxz+dP3x97++/upn31x//7t/Xb/95r9XF6O/t3joyJoE+J4ggEHkLf+Ln/z9+ttff3v9+qv/XNdi8v/eeUvgeBsKqF8swN6Rt/xPf/jXL2/50Jj8e7MnDzEUADDKH//w7+BGvyGB2SEBQwEAg8ikXo6Y+bffDAmWJKB+EwD2TI5ewIIE3qwSzAngXvsGAOwZmenPFTP//pvvF85JgJOEARSJmQAMkMAnHwnwVSEAJWT5L2cs/M7/7SVgaRDAELL2X0EC5zUJMB8Au0XG4oLW7//wu3/OKgAJ6VnM/NZlTQLMB8AucLn18uYdz8RLUo5WmXL3AiQWpPZ/8wJTCXCkOHTHWm79NLQkIGUsESs9mw9LElB/YACphOTWT0NLAvK7JWJFAl/yBcYC+KD98ABCkXF0Sm79NEQcta9BegFrvRMXoUKTWJHA43VGAuwXAPNIpZa3/O8u/4xqFFshIql9Tb69gN/88h/B17MigS+Tg0wKglnkLS+Td1L5cybQrIWGBHxkJj2FmEzCtdWO64wEmBQEM/h0j0tEbQn4bhSSYUpuCRyHzURjCXCUGJhBK2pLwHdII7IoIIHPmYOsDIBJtKKmBGRC0zfcMmdobEjgc+agEwBHi4MptKKmBHznOWQSVP5+AQl8XiFAAmASraglgZAG7U4NLiCBzysETgJn7YcOMEYjZDJSViJqXF/IaocMBeT/KSCBz8eNIQEwSY2QhiiNXsbmshxZ69pCNgq5oYAQIwG5to37/I7lwR3jds1NqdkglsgdMgsvy2ySaKS5U1AI2Sg0bsQxEthKg74igf3g8ul9M+2kayx/V8ajrjtas6wpIWWXt7w0AGk4tcu/RkgvQJ7T+P8tIYFXDpwm1DFS4aS7m5peK41KKlOtxhRT2eXtKsJa2D9vhpBegEg79b6ESED95kA+pLKUSLN1qas1yh8a2l18H3w3Crl7PZUuEoBN5C1YI8d+8qHL7PQqgZDtwnONt5AEHpBAB8gbI2aHWUqUFEGPEgjpBUjMTc4WksAZCTSOvP1zfagiJKRCl1pFiKnslib/5gj5otDSmQY5JOCOVRs9uzPZgg0jD1Nrt51EqQM4Yiq79rPYImRydmlyM3bCdO5YtVHPCQm0Sq5v1aVGid5AbxIIeVZracs5v0yEBBSQxpKry2pFABIl0mxTJCBvUXnzSY7DdJLU5Q+4LMFazz6kF7A2t5FTAqPlRyRQgvHptlIZXTcs1+RViaOpY6PEhpvQyi73Vxp1aD6E/P3pWrzmtUyTg8b/Rq4zFF2M5gqQQA6WzrCfRs4ZbKm8ViL3/azd05FnVirJKKThugk7d6RayQlfJJBAyBn208i9jBUzMei6w1L+mCO55yJ3Ayp1/PZayH3MfR0xPZpagQQiK2Zqgymxli0V16fySPmXJvFSexW5r0tDAhK5RWBp2DYNJBBIaKLHUpRKaFnLFfDt6qaIoBcJSIjoc0zglviuYM5AAkqVsmRWm1TcqQhkUjKkQseKricJSOT4CpHlXoAEEghsXLnGajVSW13li0nkEWlYuC5tCUik5j9YDyQQQM5Z+Fr57bF5/bGNL3fKrgUJpPYGrIYMd0T2JAsFkPNTV9Y3ucRsQlpa207BggRSr0sznXsc7tzElSPUkMAauderrUsgZl26xFd8LUhAImWloNZn07bCI5kLCayR+4OXliUQk5I6d/BFDmIlIBILzd1Yi5RsQiQQyfQDlJplCfk6jG9YlYBvrsE0SvQCBF8JuK7u3H2V55eacZeySzK3BORaYlYczEtgLr9+HJoNo4TJLUpAyhQjgJKSlpfBVoWXxr/VC5lbNq11jSn1xx3yOndQaoFrqCcBl18fkhOt2TBKROnNKrkb2lLI86txiMdcGd1moZB/I3Z4kDI5GCIBuZ/SLiaHfcwSGqoScFs6U8ZoWg3EZ73cUvc5BGlAKYkstQQwxslAGmXMZF3K9caWeUkC07d86L8bOk+lJgGpJDlCo5H4pnvGVCwNCbh5Filv6oRZaAaiFVJ6drG/6STgNmz5vOVD/l3fUJNAriUejQrj27hjJg5rSyDXsEbkYWkoE0NsxP6eha3JEioSyJlmW7uihGz6iKlYrUpA4ytEuYmJEolQqTQhgZyJHrVvsG/GnPtIZGi0KoHxdZf+5kAprK2AxBKz6rDxb+aXQM4Em5o3N6QH4xpCaLQuARfyjGue0ZeDmCh1mnIK5iWQO8225s0N6cG4rnFo9CIBFyUOGbV0Hyz2esxLIHeaba0bG9ILGH8vPjR6k4CExbfllNglQgufaJ8Smn/g8XzySaDlNNuQHsz47RAaPUpAotTKgchZKnHKpGTsPZAGVPNZ+bKWfxD5OfZ8Emg5zTakB5OSwtmrBCRKvDVd0lbsacCxeyIkrC6JunY2zjJMXI7MI4FSla2GBFK+ERcaPUsg97Bg7jAXuX++b7jYPRESpXZH5qBA/kEeCZTaNllDAiEbTKblCQ0tCcg1ulRVGbbJfx+T4yRliVwNZ01ebufgXGOQ35frS62PFtK7K5IuAd8Em5jz60pLIPXrMKFhfRIt9Si1HMuGoRt+3BkCuT7Ukeu04YZIl4DvzGvM8mFpCYR+HWb6/4eGxeSTKSkiyPEG1fjM+jgsbvcuTJoEfHsB8mBjxqclH0iOb8SFRgsSEGKHBqnXp31Mdyt5D5lJk4DvQ3Onv4RGSQmEVLilN1xotCKBmANHU69P+0vL1odqBYmXQEiCjUziWJJAyEahtZni0JhrJFIWa0kpsTkfsRKQ+qEZGmckGCJeAr5ptq4rbUkCIb2AtTdEaEgjmTtSzdpsdOzSYooEtI7oTk1G6oA4CYT0Atw4y4oEQg88WXtL5wprEoidHEwZDqSeBxgT1u67EnESCBm/ufVcKxII2Si0NU7MFdYqY+zE4HhfRY3nExtyfTtcBVgiTgK+lWQ8q25BAqEHniz9vogt5+fJckhAxvFyban3LOW6cqXayv0tkYAm9yck63AnhEsgpBcwrtwxEsidvx3ylnFdW5eF5g5NLRGpEpiOqX2O454jVWy5U1qlzuS45/IyovEvEi6BkK7ieDwdI4Hc3eSQssvfzb01eilKjKVD3no5Um1LHsUl9UgEFXOMd6mz/joiTAIhDXk6PtSWgPY69FqkSMBnpcNtMR3vG3AnEOcSXc0DOMZ7Hsa46zPQsFoiTAIhJp4+DG0J1Hqrx0SsBHLOS6SExQM5wRt/CYQ04rkDGTQlYLkXIBEjgZrbhLeCt2/T+EsgZBfgXNdQUwIxOxhrRqgEch7rnhpWD98Ab/wkEJJmu9Q11JSAlc9Ez4Xcr9CNK9o77VzsON++J/wkEJJmu/RmSJHA+JPlbkdiyIVakkDIxyfniN3ckzsQQDdsSyDXZpsYCSwt07UsgdSHJs9Dsycgz9jiUdwQzbYEQhJs1rq1OSeyQk+w6UkCgjuFt3bIfWTdvTvWJRA6AbXWvc0pgdC5ghINRnooMZNzOR+gyLDG0qf8Bm//blmXQMpmG5dfnzMhxUWoBFI3pSyd6V7gazDBSFmkXCVWC2TYQePvnnUJhFQsl7VVo+tdWgLuyy1bZ7pbkIBDZCDlTZ0vcKsVdPt3w7IELCfY5JRAwpdbTElgjFtNEZGtldFde8pqBTTPsgQsp9mmSCDjl1vMSgAggHkJWO4FSIRKwG04yX0DkQB0wLwELC2pzYWVk3iQAHTAvASshxUJxKw6aJcZYMJnCbyf/oG1kAks9y09SzvWkAB0wPnda718N/0DK5OCMolnecYaCUAHzEvAypyA9S/2hEqAwzfAIEgghS0JjI/14pBLMMrBSeBl/Ae5JCBvPklYkfThmE9NtSQB3yxDAGN8kcBl/AexEth68/UmAZd/wFseGiZeAtO3vM8P9iYBgA547yRwHv/BVAIp+fVjQje3IAGAskj7n5WA5NaXGN+GDjOQAEBRPo4lcF/jR5EAgCkuYwkEf5Q0hlAJzH2/AACy8TSWwJvU4RKw4QbAFOcvEhhE8Kn0jyIBAFPcTyVwKf2jSADAFB+mEngq/aO++QeyY1DyDyztGAToDdf2xxJ4KP2jcxIgvx5AhZc5CRRfIXD5ByFZhgBQhKc3ErjO7CYEgG55WJLAi2KhAKAehyUJFJ8cBAB9xu1+KoGTduEAoDiXgbAGKwAABBtJREFUNQncGSggAJTlcVECgwg+GigkAJTjfksCzAsA9M37LQkwLwDQL5dpm5+TQJUdhQCgwsOmBK6VNhMBgAoffCVQfB8BAFTn41x7X5IAS4UA/fHoLQFSiAG65M1QYEsCDAkA+mF2KLAlAYYEAP1wDpbAIIJnA4UHgHTuYiVA4hBA+7xJEPKWwCCC4qcQA0BRTqkSOCsWHgDS+LTVxn0kwAQhQLssTgh6S2AQATsLAdpkcUIwVAJVvlUIAFl58mnfXhIYRMCmIoC22OwFhEqA3gBAO6wuC0ZJgN4AQFMcSkmA3gCAfbx7AcESoDcA0ASzuwVzSoDeAIBdvFYEkiQwiICNRQA2uaslAbIIAexxjmnPURIYRMCeAgA7yEa/97Ul8P7IDkMAK5xi23K0BAYR3Bu4eIC9c0lpx0kSGETAkiGALnfaEpBJQoYFADqcU9twsgQGEXAyMUB9XnK03ywSYFgAoEJQZmANCTAsAKjHmw+LqktgEAGrBQDlueRst1klMIiAo8gAyhGdFFRTApJExHcMAcpwyN1ms0tgEMGHI/MDALk5l2ivRSQwiID5AYB8PJdqq8UkMIiATUYA6cjwOus8QDUJDCJgohAgHhlWZ8kH0JQAE4UA8RxKt9HiEhiJ4KOBGwrQEqca7bOKBAYRsGIA4M+5VtusJgFEAODNU812WVUCgwhYOgRYpqoAVCQwiOBk4GYDWKO6ANQkgAgA3qAiAFUJIAKAL6gJQF0CiABAVwAmJIAIYMeoC8CMBAYRyDcOWT6EvWBCAKYkMIiAPALYA4/abc2sBEYiYK8B9MpJu42Zl8AgAjYdQW9ID/deu201I4GRCNiGDD0gm+eKbgfuUgIjGfBhE2iZogeC7EICgwhYOYAWMTUB2LQEBhHIx02YJ4AWkBfWSbvNdCeBkQweDTxkgCXkRWV2/N+FBAYRyHZkhgdgjSa6/11IYBCBrB48G3jwADL7f9BuE7uTwEgG9ApAExmemp79714CgwjoFUBtmn77dyeBkQwOR041hvLIR3Wafvt3K4GRDOQhMUSA3FxeudOu30jAXwSSV0DaMeRAlv0O2nUaCaTJ4GKgIkF7yNDypF2HkUA+Gch8ATIAH3bR+HcngYkMGCbAHLtq/LuVwEgGbs6ACUSQHqLJvf5IoI4MJMdAtiuztLgvRP7yErjTroPaqBfAEsfb0Wb0DvpG3vpyunU36/ypqBfAKsdbOjJZiH0gS3zS27vTrlcWUS9ACwxCoIfQFs80fD/UC9Aax9uQQTISWW60hbztZTOPCJuufgDqBWid423J8Ty8eZhcrMdluO80+kTUC9Abx9tqgxPD01BZGUbEI2/451GDb+rUnhZQL8CeGOQgPAyV+nGQhGMvPYlPk+t+Gu6Ha+hyj3i7V+J/vjPhfEEAXuUAAAAASUVORK5CYII=" alt={`logo of AS44354`} />
            </div>
            <div className='h-full w-[1px] bg-gray-300 min-h-[30px] sm:block hidden' />
            <span className='text-2xl font-semibold sm:block hidden'>Looking Glass</span>
          </div>
          <div className="w-full md:w-[180px] h-full flex items-center">
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Select a location" />
              </SelectTrigger>
              <SelectContent>
                {props.data.locations.map((location, index) => (
                  <SelectGroup key={location.name}>
                    <SelectLabel>{location.name}</SelectLabel>
                    {location.locations.map((location, index) => (
                      <SelectItem key={location.name} value={location.api}>{location.name}</SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className='rounded-md grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border bg-card'>
          <div className='flex flex-col p-3'>
            <span className='text-xs text-gray-400'>IP Address</span>
            <code>{selectedLocation.ip.length === 0 ? "Not set" : selectedLocation.ip}</code>
          </div>
          <div className='flex flex-col p-3'>
            <span className='text-xs text-gray-400'>Location</span>
            <code>{selectedLocation.location.length === 0 ? "Not set" : selectedLocation.location}</code>
          </div>
          <div className='flex flex-col p-3'>
            <span className='text-xs text-gray-400'>Datacenter</span>
            <code>{selectedLocation.datacenter.length === 0 ? "Not set" : selectedLocation.datacenter}</code>
          </div>
        </div>

        <div className='rounded-md p-3 gap-4 flex flex-col border bg-card'>
          <span className='text-lg'>Looking Glass</span>
          <div className='flex flex-col md:flex-row gap-4'>
            <Input className='flex-1' placeholder={`Enter a ${type == "bgp" ? "IP" : "IP or Hostname"}`} disabled={disabled} ref={inputRef} />
            <Select value={type} onValueChange={setType} disabled={disabled}>
              <SelectTrigger className='w-auto min-w-[180px]'>
                <SelectValue placeholder="" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {selectedLocation.pingtrace && (
                    <>
                      <SelectItem value="ping">Ping</SelectItem>
                      <SelectItem value="mtr">MTR</SelectItem>
                      <SelectItem value="traceroute">Traceroute</SelectItem>
                    </>
                  )}
                  {selectedLocation.bgp && (
                    <SelectItem value="bgp">BGP Route Trace</SelectItem>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button disabled={disabled} onClick={submit}>Submit</Button>
          </div>
        </div>
        {error.length > 0 && (
          <Alert className='border-red-500'>
            <AlertTitle>An error occured</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}
        {data.length > 0 && (
          <div className='rounded-md p-3 gap-4 flex flex-col border bg-card'>
            <span className='text-lg'>Results</span>
            <div className='flex flex-col p-3 bg-black rounded-md overflow-auto'>
              {data.split("\n").map((line, i) => (
                <>
                  {line === "" ? <br /> : <pre key={i} className='term'>{line}</pre>}
                </>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export async function getServerSideProps() {
  const data: Config = JSON.parse(fs.readFileSync('public/config.json').toString());
  return {
    props: {
      data
    }
  }
}
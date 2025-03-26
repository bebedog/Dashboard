import { Row, Table, Modal, Spin, Input, Space, Button, Tag, Pagination, Form, InputNumber, Popconfirm, Tabs, Flex, Collapse } from "antd";
import React, { useEffect, useState, useRef, useContext } from "react";


function LaserProfile(props) {
    const {laserProfile} = props

    return (
        <Table
            style={{ margin: '12px 0 0', minWidth: "100%", minHeight: "100vh" }}
            size="large"
            pagination={{ pageSize: 5 }}
            bordered
            columns={[
                { key: 0, title: `Saved Lasers (${laserProfile?.length} laser saved)`, dataIndex: 'profile' },
            ]}
            dataSource={(() => {
                return laserProfile?.map((profile, index) => {
                    const laserTypeAndSource = (() => {
                        let laserOperation = null
                        let laserSource = null
                        if (profile.data.laserOperation === 'cw') {
                            laserOperation = 'Continuous Wave'
                        } else if (profile.data.laserOperation === 'singlePulse') {
                            laserOperation = 'Single Pulse'
                        } else if (profile.data.laserOperation === 'repetitivelyPulsed') {
                            laserOperation = 'Repetitively Pulsed'
                        } else if (profile.data.laserOperation === 'FO_repetitivelyPulsed') {
                            laserOperation = 'Repetitively Pulsed'
                        } else if (profile.data.laserOperation === 'FO_cw') {
                            laserOperation = 'Fiber Optic Continous Wave'
                        }
                        else if (profile.data.laserOperation === 'FO_singlePulse') {
                            laserOperation = 'Fiber Optic Single Pulse'
                        }
                        else if (profile.data.laserOperation === 'diffuseReflectiveCW') {
                            laserOperation = 'Diffuse Reflective Continious Wave'
                        }
                        else if (profile.data.laserOperation === 'diffuseReflectiveRepetitivelyPulsed') {
                            laserOperation = 'Diffuse Reflective Repetitively Pulsed'
                        }
                        else if (profile.data.laserOperation === 'diffuseReflectiveSinglePulse') {
                            laserOperation = 'Diffuse Reflective Single Pulse'
                        }

                        if (profile.data.sourceType === 'point') {
                            laserSource = 'Point Source'
                        } else if (profile.data.sourceType === 'extended') {
                            laserSource = 'Extended Source'
                        }
                        else if (profile.data.sourceType === 'singlemode') {
                            laserSource = 'Single Mode'
                        }
                        else if (profile.data.sourceType === 'multimodeSI') {
                            laserSource = 'Multimode Step Index'
                        }
                        else if (profile.data.sourceType === 'multimodeGI') {
                            laserSource = 'Multimode Graded Index'
                        }

                        return {
                            type: laserOperation,
                            source: laserSource
                        }
                    })()
                    return (
                        {
                            key: 0,
                            profile: (
                                <Collapse
                                    bordered={false}
                                    collapsible="icon"
                                    size="small"
                                    items={[
                                        {
                                            key: index,
                                            label: profile.description,
                                            children: (
                                                <Flex justify="center" vertical>
                                                    <Table
                                                        bordered
                                                        size='small'
                                                        style={{ width: '100%' }}
                                                        pagination={{
                                                            hideOnSinglePage: true
                                                        }}
                                                        columns={[
                                                            {
                                                                key: `${index}_0`,
                                                                title: 'Type',
                                                                dataIndex: 'type',
                                                                width: '50%'
                                                            },
                                                            {
                                                                key: `${index}_1`,
                                                                title: 'Value',
                                                                dataIndex: 'value'
                                                            }
                                                        ]}
                                                        dataSource={[
                                                            {
                                                                key: 0,
                                                                type: 'Laser Type',
                                                                value: laserTypeAndSource.type
                                                            },
                                                            {
                                                                key: 1,
                                                                type: 'Source Type',
                                                                value: laserTypeAndSource.source
                                                            }
                                                        ]}
                                                    />
                                                    <Table
                                                        style={{ margin: '12px 0 0' }}
                                                        bordered
                                                        size='small'
                                                        pagination={{ hideOnSinglePage: true }}
                                                        columns={[
                                                            {
                                                                key: 0,
                                                                title: 'Laser Params',
                                                                dataIndex: 'laserParams',
                                                                width: '50%'
                                                            },
                                                            {
                                                                key: 1,
                                                                title: 'Value',
                                                                dataIndex: 'value'
                                                            }
                                                        ]}
                                                        dataSource={
                                                            // The long ass logic starts here:
                                                            (() => {
                                                                if (profile.data?.cw !== undefined && profile.data?.cw !== null) {
                                                                    if (profile.data?.extendedSettings === undefined) {
                                                                        return (
                                                                            [
                                                                                {
                                                                                    key: 0,
                                                                                    laserParams: 'Wavelength',
                                                                                    value: `${profile.data.cw.wavelength.num} ${profile.data.cw.wavelength.unit}m`
                                                                                },
                                                                                {
                                                                                    key: 1,
                                                                                    laserParams: `Exposure Time`,
                                                                                    value: profile.data.cw.time.unit === false ? `${profile.data.cw.time.num} s` : `${profile.data.cw.time.num} ${profile.data.cw.time.unit}s`
                                                                                },
                                                                                {
                                                                                    key: 2,
                                                                                    laserParams: 'Power',
                                                                                    value: profile.data.cw.power.unit === false ? `${profile.data.cw.power.num} W` : `${profile.data.cw.power.num} ${profile.data.cw.power.unit}W`
                                                                                },
                                                                                {
                                                                                    key: 3,
                                                                                    laserParams: 'Beam Diameter',
                                                                                    value: `${profile.data.cw.beamDiameter.num} ${profile.data.cw.beamDiameter?.unit ?
                                                                                        ('μm') :
                                                                                        ('mm')}`
                                                                                },
                                                                                {
                                                                                    key: 4,
                                                                                    laserParams: 'Beam Divergence',
                                                                                    value: profile.data.cw.beamDivergence.unit === false ? `${profile.data.cw.beamDivergence.num} m` : `${profile.data.cw.beamDivergence.num} ${profile.data.cw.beamDivergence.unit}m`
                                                                                },
                                                                                {
                                                                                    key: 5,
                                                                                    laserParams: 'Distance to target',
                                                                                    value: profile.data.cw.distance.unit === false ? `${profile.data.cw.distance.num} m` : `${profile.data.cw.distance.num} ${profile.data.cw.distance.unit}m`
                                                                                }
                                                                            ]
                                                                        )
                                                                    } else {
                                                                        return (
                                                                            [
                                                                                {
                                                                                    key: 0,
                                                                                    laserParams: 'Wavelength',
                                                                                    value: `${profile.data.cw.wavelength.num} ${profile.data.cw.wavelength.unit}m`
                                                                                },
                                                                                {
                                                                                    key: 1,
                                                                                    laserParams: `Exposure Time`,
                                                                                    value: profile.data.cw.time.unit === false ? `${profile.data.cw.time.num} s` : `${profile.data.cw.time.num} ${profile.data.cw.time.unit}s`
                                                                                },
                                                                                {
                                                                                    key: 2,
                                                                                    laserParams: 'Power',
                                                                                    value: profile.data.cw.power.unit === false ? `${profile.data.cw.power.num} W` : `${profile.data.cw.power.num} ${profile.data.cw.power.unit}W`
                                                                                },
                                                                                {
                                                                                    key: 3,
                                                                                    laserParams: 'Apparent Source Size',
                                                                                    value: profile.data.extendedSettings.apparentSourceSize.unit === false ? `${profile.data.extendedSettings.apparentSourceSize.num}` : `${profile.data.extendedSettings.apparentSourceSize.num} ${profile.data.extendedSettings.apparentSourceSize.unit}m`
                                                                                },
                                                                                {
                                                                                    key: 3,
                                                                                    laserParams: 'Beam Divergence',
                                                                                    value: profile.data.cw.beamDivergence.unit === false ? `${profile.data.cw.beamDivergence.num} m` : `${profile.data.cw.beamDivergence.num} ${profile.data.cw.beamDivergence.unit}m`
                                                                                },
                                                                                {
                                                                                    key: 4,
                                                                                    laserParams: 'Distance to target',
                                                                                    value: profile.data.cw.distance.unit === false ? `${profile.data.cw.distance.num} m` : `${profile.data.cw.distance.num} ${profile.data.cw.distance.unit}m`
                                                                                }
                                                                            ]
                                                                        )
                                                                    }
                                                                }
                                                                else if (profile.data?.singlePulse !== undefined && profile.data?.singlePulse !== null) {
                                                                    if (profile.data?.extendedSettings === undefined) {
                                                                        // point source
                                                                        return ([
                                                                            {
                                                                                key: 0,
                                                                                laserParams: 'Wavelength',
                                                                                value: `${profile.data.singlePulse.wavelength.num} nm`
                                                                            },
                                                                            {
                                                                                key: 1,
                                                                                laserParams: 'Pulse Duration',
                                                                                value: profile.data.singlePulse.pulseDuration.unit === false ? `${profile.data.singlePulse.pulseDuration.num} s` : `${profile.data.singlePulse.pulseDuration.num} ${profile.data.singlePulse.pulseDuration.unit}s`
                                                                            },
                                                                            {
                                                                                key: 2,
                                                                                laserParams: (() => {
                                                                                    if (profile.data.singlePulse.outputUnits === 'energy') {
                                                                                        return "Laser Energy"
                                                                                    }
                                                                                    else if (profile.data.singlePulse.outputUnits === 'peakPower') {
                                                                                        return "Peak Power"
                                                                                    }
                                                                                })(),
                                                                                value: (() => {
                                                                                    if (profile.data.singlePulse.outputUnits === 'energy') {
                                                                                        return profile.data.singlePulse.energy.unit === false ? `${profile.data.singlePulse.energy.num} J` : `${profile.data.singlePulse.energy.num} ${profile.data.singlePulse.energy.unit}J`
                                                                                    }
                                                                                    else if (profile.data.singlePulse.outputUnits === 'peakPower') {
                                                                                        return profile.data.singlePulse.peakPower.unit === false ? `${profile.data.singlePulse.peakPower.num} J` : `${profile.data.singlePulse.peakPower.num} ${profile.data.singlePulse.peakPower.unit}J`
                                                                                    }
                                                                                })()
                                                                            },
                                                                            {
                                                                                key: 3,
                                                                                laserParams: 'Beam Diameter',
                                                                                value: `${profile.data.singlePulse.beamDiameter.num} ${profile.data.singlePulse.beamDiameter?.unit ? 'μm' : 'mm'}`


                                                                            },
                                                                            {
                                                                                key: 4,
                                                                                laserParams: 'Beam Divergence',
                                                                                value: profile.data.singlePulse.beamDivergence.unit === false ? `${profile.data.singlePulse.beamDivergence.num} m` : `${profile.data.singlePulse.beamDivergence.num} ${profile.data.singlePulse.beamDivergence.unit}rad`
                                                                            },
                                                                            {
                                                                                key: 5,
                                                                                laserParams: 'Distance to target',
                                                                                value: profile.data.singlePulse.distance.unit === false ? `${profile.data.singlePulse.distance.num} m` : `${profile.data.singlePulse.distance.num} ${profile.data.singlePulse.distance.unit}m`
                                                                            }
                                                                        ])
                                                                    }
                                                                    else {
                                                                        // extended source
                                                                        return ([
                                                                            {
                                                                                key: 0,
                                                                                laserParams: 'Wavelength',
                                                                                value: `${profile.data.singlePulse.wavelength.num} nm`
                                                                            },
                                                                            {
                                                                                key: 1,
                                                                                laserParams: 'Pulse Duration',
                                                                                value: profile.data.singlePulse.pulseDuration.unit === false ? `${profile.data.singlePulse.pulseDuration.num} s` : `${profile.data.singlePulse.pulseDuration.num} ${profile.data.singlePulse.pulseDuration.unit}s`
                                                                            },
                                                                            {
                                                                                key: 2,
                                                                                laserParams: (() => {
                                                                                    if (profile.data.singlePulse.outputUnits === 'energy') {
                                                                                        return "Laser Energy"
                                                                                    }
                                                                                    else if (profile.data.singlePulse.outputUnits === 'peakPower') {
                                                                                        return "Peak Power"
                                                                                    }
                                                                                })(),
                                                                                value: (() => {
                                                                                    if (profile.data.singlePulse.outputUnits === 'energy') {
                                                                                        return profile.data.singlePulse.energy.unit === false ? `${profile.data.singlePulse.energy.num} J` : `${profile.data.singlePulse.energy.num} ${profile.data.singlePulse.energy.unit}J`
                                                                                    }
                                                                                    else if (profile.data.singlePulse.outputUnits === 'peakPower') {
                                                                                        return profile.data.singlePulse.peakPower.unit === false ? `${profile.data.singlePulse.peakPower.num} J` : `${profile.data.singlePulse.peakPower.num} ${profile.data.singlePulse.peakPower.unit}W`
                                                                                    }
                                                                                })()
                                                                            },
                                                                            {
                                                                                key: 3,
                                                                                laserParams: 'Apparent Source Size',
                                                                                value: profile.data.extendedSettings.apparentSourceSize.unit === false ? `${profile.data.extendedSettings.apparentSourceSize.num} m` : `${profile.data.extendedSettings.apparentSourceSize.num} ${profile.data.extendedSettings.apparentSourceSize.unit}m`
                                                                            },
                                                                            {
                                                                                key: 4,
                                                                                laserParams: 'Beam Divergence',
                                                                                value: profile.data.singlePulse.beamDivergence.unit === false ? `${profile.data.singlePulse.beamDivergence.num} m` : `${profile.data.singlePulse.beamDivergence.num} ${profile.data.singlePulse.beamDivergence.unit}rad`
                                                                            },
                                                                            {
                                                                                key: 5,
                                                                                laserParams: 'Distance to target',
                                                                                value: profile.data.singlePulse.distance.unit === false ? `${profile.data.singlePulse.distance.num} m` : `${profile.data.singlePulse.distance.num} ${profile.data.singlePulse.distance.unit}m`
                                                                            }
                                                                        ])
                                                                    }
                                                                }
                                                                else if (profile.data?.repetitivelyPulsed !== undefined && profile.data?.repetitivelyPulsed !== null) {
                                                                    if (profile.data?.extendedSettings === undefined) {
                                                                        // point source
                                                                        return ([
                                                                            {
                                                                                key: 0,
                                                                                laserParams: 'Wavelength',
                                                                                value: `${profile.data.repetitivelyPulsed.wavelength.num} nm`
                                                                            },
                                                                            {
                                                                                key: 1,
                                                                                laserParams: (() => {
                                                                                    if (profile.data.repetitivelyPulsed.outputUnits === 'energy') {
                                                                                        return 'Pulse Energy'
                                                                                    } else if (profile.data.repetitivelyPulsed.outputUnits === 'peakPower') {
                                                                                        return 'Peak Power'
                                                                                    } else if (profile.data.repetitivelyPulsed.outputUnits === 'averagePower') {
                                                                                        return 'Average Power'
                                                                                    }
                                                                                })(),
                                                                                value: (() => {
                                                                                    if (profile.data.repetitivelyPulsed.outputUnits === 'energy') {
                                                                                        return profile.data.repetitivelyPulsed.energy.unit === false ? `${profile.data.repetitivelyPulsed.energy.num} J` : `${profile.data.repetitivelyPulsed.energy.num} ${profile.data.repetitivelyPulsed.energy.unit}J`
                                                                                    } else if (profile.data.repetitivelyPulsed.outputUnits === 'peakPower') {
                                                                                        return profile.data.repetitivelyPulsed.peakPower.unit === false ? `${profile.data.repetitivelyPulsed.peakPower.num} W` : `${profile.data.repetitivelyPulsed.peakPower.num} ${profile.data.repetitivelyPulsed.peakPower.unit}W`
                                                                                    } else if (profile.data.repetitivelyPulsed.outputUnits === 'averagePower') {
                                                                                        return profile.data.repetitivelyPulsed.averagePower.unit === false ? `${profile.data.repetitivelyPulsed.averagePower.num} W` : `${profile.data.repetitivelyPulsed.averagePower.num} ${profile.data.repetitivelyPulsed.averagePower.unit}W`
                                                                                    }
                                                                                })()
                                                                            },
                                                                            {
                                                                                key: 2,
                                                                                laserParams: 'Exposure Duration',
                                                                                value: profile.data.repetitivelyPulsed.time.unit === false ? `${profile.data.repetitivelyPulsed.time.num} s` : `${profile.data.repetitivelyPulsed.time.num} ${profile.data.repetitivelyPulsed.time.unit}s`
                                                                            },
                                                                            {
                                                                                key: 3,
                                                                                laserParams: 'Pules Duration',
                                                                                value: profile.data.repetitivelyPulsed.pulseDuration.unit === false ? `${profile.data.repetitivelyPulsed.pulseDuration.num} s` : `${profile.data.repetitivelyPulsed.pulseDuration.num} ${profile.data.repetitivelyPulsed.pulseDuration.unit}s`
                                                                            },
                                                                            {
                                                                                key: 4,
                                                                                laserParams: 'Pulse Frequency',
                                                                                value: profile.data.repetitivelyPulsed.pulseFrequency.unit === false ? `${profile.data.repetitivelyPulsed.pulseFrequency.num} Hz` : `${profile.data.repetitivelyPulsed.pulseFrequency.num} ${profile.data.repetitivelyPulsed.pulseFrequency.unit}Hz`
                                                                            },
                                                                            {
                                                                                key: 5,
                                                                                laserParams: 'Beam Diameter',
                                                                                value: `${profile.data.repetitivelyPulsed.beamDiameter.num} ${profile.data.repetitivelyPulsed.beamDiameter?.unit ? 'μm' : 'mm'}`
                                                                            },
                                                                            {
                                                                                key: 6,
                                                                                laserParams: 'Beam Divergence',
                                                                                value: profile.data.repetitivelyPulsed.beamDivergence.unit === false ? `${profile.data.repetitivelyPulsed.beamDivergence.num} rad` : `${profile.data.repetitivelyPulsed.beamDivergence.num} ${profile.data.repetitivelyPulsed.beamDivergence.unit}rad`
                                                                            },
                                                                            {
                                                                                key: 7,
                                                                                laserParams: 'Distance to target',
                                                                                value: profile.data.repetitivelyPulsed.distance.unit === false ? `${profile.data.repetitivelyPulsed.distance.num} m` : `${profile.data.repetitivelyPulsed.distance.num} ${profile.data.repetitivelyPulsed.unit}m`
                                                                            }
                                                                        ])
                                                                    }
                                                                    else {
                                                                        // extended source
                                                                        return ([
                                                                            {
                                                                                key: 0,
                                                                                laserParams: 'Wavelength',
                                                                                value: `${profile.data.repetitivelyPulsed.wavelength.num} nm`
                                                                            },
                                                                            {
                                                                                key: 1,
                                                                                laserParams: (() => {
                                                                                    if (profile.data.repetitivelyPulsed.outputUnits === 'energy') {
                                                                                        return 'Pulse Energy'
                                                                                    } else if (profile.data.repetitivelyPulsed.outputUnits === 'peakPower') {
                                                                                        return 'Peak Power'
                                                                                    } else if (profile.data.repetitivelyPulsed.outputUnits === 'averagePower') {
                                                                                        return 'Average Power'
                                                                                    }
                                                                                })(),
                                                                                value: (() => {
                                                                                    if (profile.data.repetitivelyPulsed.outputUnits === 'energy') {
                                                                                        return profile.data.repetitivelyPulsed.energy.unit === false ? `${profile.data.repetitivelyPulsed.energy.num} J` : `${profile.data.repetitivelyPulsed.energy.num} ${profile.data.repetitivelyPulsed.energy.unit}J`
                                                                                    } else if (profile.data.repetitivelyPulsed.outputUnits === 'peakPower') {
                                                                                        return profile.data.repetitivelyPulsed.peakPower.unit === false ? `${profile.data.repetitivelyPulsed.peakPower.num} W` : `${profile.data.repetitivelyPulsed.peakPower.num} ${profile.data.repetitivelyPulsed.peakPower.unit}W`
                                                                                    } else if (profile.data.repetitivelyPulsed.outputUnits === 'averagePower') {
                                                                                        return profile.data.repetitivelyPulsed.averagePower.unit === false ? `${profile.data.repetitivelyPulsed.averagePower.num} W` : `${profile.data.repetitivelyPulsed.averagePower.num} ${profile.data.repetitivelyPulsed.averagePower.unit}W`
                                                                                    }
                                                                                })()
                                                                            },
                                                                            {
                                                                                key: 2,
                                                                                laserParams: 'Exposure Duration',
                                                                                value: profile.data.repetitivelyPulsed.time.unit === false ? `${profile.data.repetitivelyPulsed.time.num} s` : `${profile.data.repetitivelyPulsed.time.num} ${profile.data.repetitivelyPulsed.time.unit}s`
                                                                            },
                                                                            {
                                                                                key: 3,
                                                                                laserParams: 'Pulse Duration',
                                                                                value: profile.data.repetitivelyPulsed.pulseDuration.unit === false ? `${profile.data.repetitivelyPulsed.pulseDuration.num} s` : `${profile.data.repetitivelyPulsed.pulseDuration.num} ${profile.data.repetitivelyPulsed.pulseDuration.unit}s`
                                                                            },
                                                                            {
                                                                                key: 4,
                                                                                laserParams: 'Pulse Frequency',
                                                                                value: profile.data.repetitivelyPulsed.pulseFrequency.unit === false ? `${profile.data.repetitivelyPulsed.pulseFrequency.num} Hz` : `${profile.data.repetitivelyPulsed.pulseFrequency.num} ${profile.data.repetitivelyPulsed.pulseFrequency.unit}Hz`
                                                                            },
                                                                            {
                                                                                key: 5,
                                                                                laserParams: 'Apparent Source Size',
                                                                                value: profile.data.extendedSettings.apparentSourceSize.unit === false ? `${profile.data.extendedSettings.apparentSourceSize.num} m` : `${profile.data.extendedSettings.apparentSourceSize.num} ${profile.data.extendedSettings.apparentSourceSize.unit}m`
                                                                            },
                                                                            {
                                                                                key: 6,
                                                                                laserParams: 'Beam Divergence',
                                                                                value: profile.data.repetitivelyPulsed.beamDivergence.unit === false ? `${profile.data.repetitivelyPulsed.beamDivergence.num} rad` : `${profile.data.repetitivelyPulsed.beamDivergence.num} ${profile.data.repetitivelyPulsed.beamDivergence.unit}rad`
                                                                            },
                                                                            {
                                                                                key: 7,
                                                                                laserParams: 'Distance to target',
                                                                                value: profile.data.repetitivelyPulsed.distance.unit === false ? `${profile.data.repetitivelyPulsed.distance.num} m` : `${profile.data.repetitivelyPulsed.distance.num} ${profile.data.repetitivelyPulsed.unit}m`
                                                                            }
                                                                        ])
                                                                    }
                                                                }
                                                                else if (profile.data?.FO_cw !== undefined && profile.data?.FO_cw !== null) {
                                                                    return ([
                                                                        {
                                                                            key: 0,
                                                                            laserParams: 'Wavelength',
                                                                            value: `${profile.data?.FO_cw.wavelength.num} nm`
                                                                        },
                                                                        {
                                                                            key: 1,
                                                                            laserParams: 'Power',
                                                                            value: profile.data.FO_cw.power.unit === false ? `${profile.data.FO_cw.power.num} J` : `${profile.data.FO_cw.power.num} ${profile.data.FO_cw.power.unit}W`
                                                                        },
                                                                        {
                                                                            key: 2,
                                                                            laserParams: 'Exposure Duration',
                                                                            value: `${profile.data?.FO_cw.time.num} s`
                                                                        },
                                                                        {
                                                                            key: 3,
                                                                            laserParams: (() => {
                                                                                if (profile.data?.sourceType === "singlemode") {
                                                                                    return 'Beam Diameter'
                                                                                }
                                                                                else {
                                                                                    return 'Numerical Aperture'
                                                                                }
                                                                            })(),
                                                                            value: (() => {
                                                                                if (profile.data?.sourceType === "singlemode") {
                                                                                    return `${profile.data?.FO_cw.diameter.num} ${profile.data?.FO_cw.diameter.unit}m`
                                                                                }
                                                                                else {
                                                                                    return `${profile.data?.FO_cw?.numerical_aperture?.num} `
                                                                                }
                                                                            })(),

                                                                        },
                                                                        {
                                                                            key: 4,
                                                                            laserParams: 'Distance to target',
                                                                            value: profile.data.FO_cw.distance.unit === false ? `${profile.data.FO_cw.distance.num} m` : `${profile.data.FO_cw.distance.num} ${profile.data.FO_cw.unit}m`
                                                                        },
                                                                        {
                                                                            key: (() => {
                                                                                if (profile.data.sourceType === "multimodeGI") {
                                                                                    return 5
                                                                                }
                                                                            })(),
                                                                            laserParams: (() => {
                                                                                if (profile.data.sourceType === "multimodeGI") {
                                                                                    return 'Index Grading Factor'
                                                                                }
                                                                            })(),
                                                                            value: (() => {
                                                                                if (profile.data.sourceType === "multimodeGI") {
                                                                                    return profile.data.FO_cw.IGF.num
                                                                                }
                                                                            })()
                                                                        }
                                                                    ])
                                                                }
                                                                else if (profile.data?.FO_singlePulse !== undefined && profile.data?.FO_singlePulse !== null) {
                                                                    return ([
                                                                        {
                                                                            key: 0,
                                                                            laserParams: 'Wavelength',
                                                                            value: `${profile.data?.FO_singlePulse.wavelength.num} nm`
                                                                        },
                                                                        {
                                                                            key: 1,
                                                                            laserParams: 'Power',
                                                                            value: profile.data.FO_singlePulse.power.unit === false ? `${profile.data.FO_singlePulse.power.num} W` : `${profile.data.FO_singlePulse.power.num} ${profile.data.FO_singlePulse.power.unit}W`
                                                                        },
                                                                        {
                                                                            key: 2,
                                                                            laserParams: 'Pulse Duration',
                                                                            value: profile.data.FO_singlePulse.duration.unit === false ? `${profile.data.FO_singlePulse.duration.num} s` : `${profile.data.FO_singlePulse.duration.num} ${profile.data.FO_singlePulse.duration.unit}s`
                                                                        },
                                                                        {
                                                                            key: 3,
                                                                            laserParams: (() => {
                                                                                if (profile.data?.sourceType === "singlemode") {
                                                                                    return 'Beam Diameter'
                                                                                }
                                                                                else {
                                                                                    return 'Numerical Aperture'
                                                                                }
                                                                            })(),
                                                                            value: (() => {
                                                                                if (profile.data?.sourceType === "singlemode") {
                                                                                    return `${profile.data?.FO_singlePulse.diameter.num} ${profile.data?.FO_singlePulse.diameter.unit}m`
                                                                                }
                                                                                else {
                                                                                    return `${profile.data?.FO_singlePulse?.numerical_aperture?.num} `
                                                                                }
                                                                            })(),
                                                                        },
                                                                        {
                                                                            key: 4,
                                                                            laserParams: 'Distance to target',
                                                                            value: profile.data.FO_singlePulse.distance.unit === false ? `${profile.data.FO_singlePulse.distance.num} m` : `${profile.data.FO_singlePulse.distance.num} ${profile.data.FO_singlePulse.unit}m`
                                                                        },
                                                                        {
                                                                            key: (() => {
                                                                                if (profile.data.sourceType === "multimodeGI") {
                                                                                    return 5
                                                                                }
                                                                            })(),
                                                                            laserParams: (() => {
                                                                                if (profile.data.sourceType === "multimodeGI") {
                                                                                    return 'Index Grading Factor'
                                                                                }
                                                                            })(),
                                                                            value: (() => {
                                                                                if (profile.data.sourceType === "multimodeGI") {
                                                                                    return profile.data.FO_singlePulse.IGF.num
                                                                                }
                                                                            })()
                                                                        }
                                                                    ])
                                                                }
                                                                else if (profile.data?.FO_repetitivelyPulsed !== undefined && profile.data?.FO_repetitivelyPulsed !== null) {
                                                                    return ([
                                                                        {
                                                                            key: 0,
                                                                            laserParams: 'Wavelength',
                                                                            value: `${profile.data?.FO_repetitivelyPulsed.wavelength.num} nm`
                                                                        },
                                                                        {
                                                                            key: 1,
                                                                            laserParams: (() => {
                                                                                if (profile.data.FO_repetitivelyPulsed.outputUnits === 'peakPower') {
                                                                                    return 'Peak Power'
                                                                                } else if (profile.data.FO_repetitivelyPulsed.outputUnits === 'averagePower') {
                                                                                    return 'Average Power'
                                                                                }
                                                                            })(),
                                                                            value: (() => {
                                                                                if (profile.data.FO_repetitivelyPulsed.outputUnits === 'peakPower') {
                                                                                    return profile.data.FO_repetitivelyPulsed.peakPower.unit === false ? `${profile.data.FO_repetitivelyPulsed.peakPower.num} W` : `${profile.data.FO_repetitivelyPulsed.peakPower.num} ${profile.data.FO_repetitivelyPulsed.peakPower.unit}W`
                                                                                } else if (profile.data.FO_repetitivelyPulsed.outputUnits === 'averagePower') {
                                                                                    return profile.data.FO_repetitivelyPulsed.averagePower.unit === false ? `${profile.data.FO_repetitivelyPulsed.averagePower.num} W` : `${profile.data.FO_repetitivelyPulsed.averagePower.num} ${profile.data.FO_repetitivelyPulsed.averagePower.unit}W`
                                                                                }
                                                                            })()
                                                                        },
                                                                        {
                                                                            key: 2,
                                                                            laserParams: 'Exposure Duration',
                                                                            value: profile.data.FO_repetitivelyPulsed.time.unit === false ? `${profile.data.FO_repetitivelyPulsed.time.num} s` : `${profile.data.FO_repetitivelyPulsed.time.num} ${profile.data.FO_repetitivelyPulsed.time.unit}s`
                                                                        },
                                                                        {
                                                                            key: 3,
                                                                            laserParams: 'Pulse Duration',
                                                                            value: profile.data.FO_repetitivelyPulsed.duration.unit === false ? `${profile.data.FO_repetitivelyPulsed.duration.num} s` : `${profile.data.FO_repetitivelyPulsed.duration.num} ${profile.data.FO_repetitivelyPulsed.duration.unit}s`
                                                                        },
                                                                        {
                                                                            key: 4,
                                                                            laserParams: 'Pulse Frequency',
                                                                            value: profile.data.FO_repetitivelyPulsed.pulseFrequency.unit === false ? `${profile.data.FO_repetitivelyPulsed.pulseFrequency.num} Hz` : `${profile.data.FO_repetitivelyPulsed.pulseFrequency.num} ${profile.data.FO_repetitivelyPulsed.pulseFrequency.unit}Hz`
                                                                        },
                                                                        {
                                                                            key: 5,
                                                                            laserParams: (() => {
                                                                                if (profile.data?.sourceType === "singlemode") {
                                                                                    return 'Beam Diameter'
                                                                                }
                                                                                else {
                                                                                    return 'Numerical Aperture'
                                                                                }
                                                                            })(),
                                                                            value: (() => {
                                                                                if (profile.data?.sourceType === "singlemode") {
                                                                                    return `${profile.data?.FO_repetitivelyPulsed.diameter.num} ${profile.data?.FO_repetitivelyPulsed.diameter.unit}m`
                                                                                }
                                                                                else {
                                                                                    return `${profile.data?.FO_repetitivelyPulsed?.numerical_aperture?.num}`
                                                                                }
                                                                            })(),
                                                                        },
                                                                        {
                                                                            key: 6,
                                                                            laserParams: 'Distance to target',
                                                                            value: profile.data.FO_repetitivelyPulsed.distance.unit === false ? `${profile.data.FO_repetitivelyPulsed.distance.num} m` : `${profile.data.FO_repetitivelyPulsed.distance.num} ${profile.data.FO_repetitivelyPulsed.distance.unit}m`
                                                                        },
                                                                        {
                                                                            key: (() => {
                                                                                if (profile.data.sourceType === "multimodeGI") {
                                                                                    return 5
                                                                                }
                                                                            })(),
                                                                            laserParams: (() => {
                                                                                if (profile.data.sourceType === "multimodeGI") {
                                                                                    return 'Index Grading Factor'
                                                                                }
                                                                            })(),
                                                                            value: (() => {
                                                                                if (profile.data.sourceType === "multimodeGI") {
                                                                                    return profile.data.FO_repetitivelyPulsed.IGF.num
                                                                                }
                                                                            })()
                                                                        }
                                                                    ])
                                                                }
                                                                else if (profile.data?.diffuseReflectiveCW !== undefined && profile.data?.diffuseReflectiveCW !== null) {
                                                                    return ([
                                                                        {
                                                                            key: 0,
                                                                            laserParams: 'Wavelength',
                                                                            value: `${profile.data?.diffuseReflectiveCW.wavelength.num} nm`
                                                                        },
                                                                        {
                                                                            key: 1,
                                                                            laserParams: 'Peak Power',
                                                                            value: profile.data.diffuseReflectiveCW.power.unit === false ? `${profile.data.diffuseReflectiveCW.power.num} W` : `${profile.data.diffuseReflectiveCW.power.num} ${profile.data.diffuseReflectiveCW.power.unit}W`
                                                                        },
                                                                        {
                                                                            key: 2,
                                                                            laserParams: 'Exposure Duration',
                                                                            value: profile.data.diffuseReflectiveCW.time.unit === false ? `${profile.data.diffuseReflectiveCW.time.num} s` : `${profile.data.diffuseReflectiveCW.time.num} ${profile.data.diffuseReflectiveCW.time.unit}s`
                                                                        },
                                                                        {
                                                                            key: 3,
                                                                            laserParams: 'Beam Diameter',
                                                                            value: `${profile?.data?.diffuseReflectiveCW?.beamDiameter?.num}m`
                                                                        },
                                                                        {
                                                                            key: 4,
                                                                            laserParams: 'Distance to target',
                                                                            value: profile.data.diffuseReflectiveCW.distance.unit === false ? `${profile.data.diffuseReflectiveCW.distance.num} m` : `${profile.data.diffuseReflectiveCW.distance.num} ${profile.data.diffuseReflectiveCW.distance.unit}m`
                                                                        },
                                                                        {
                                                                            key: 5,
                                                                            laserParams: 'Beam Divergence',
                                                                            value: profile.data.diffuseReflectiveCW.beamDivergence.unit === false ? `${profile.data.diffuseReflectiveCW.beamDivergence.num} m` : `${profile.data.diffuseReflectiveCW.beamDivergence.num} ${profile.data.diffuseReflectiveCW.beamDivergence.unit}m`
                                                                        },
                                                                        {
                                                                            key: 6,
                                                                            laserParams: 'Albedo',
                                                                            value: `${profile.data.diffuseReflective.albedo.num} %`
                                                                        },
                                                                        {
                                                                            key: 7,
                                                                            laserParams: 'Distance2',
                                                                            value: profile.data.diffuseReflective.distance2.unit === false ? `${profile.data.diffuseReflective.distance2.num} m` : `${profile.data.diffuseReflective.distance2.num} ${profile.data.diffuseReflective.distance2.unit}m`
                                                                        }
                                                                    ])
                                                                }
                                                                else if (profile.data?.diffuseReflectiveSP !== undefined && profile.data?.diffuseReflectiveSP !== null) {
                                                                    return ([
                                                                        {
                                                                            key: 0,
                                                                            laserParams: 'Wavelength',
                                                                            value: `${profile.data?.diffuseReflectiveSP.wavelength.num} nm`
                                                                        },
                                                                        {
                                                                            key: 1,
                                                                            laserParams: 'Energy',
                                                                            value: profile.data.diffuseReflectiveSP.energy.unit === false ? `${profile.data.diffuseReflectiveSP.energy.num} J` : `${profile.data.diffuseReflectiveSP.energy.num} ${profile.data.diffuseReflectiveSP.energy.unit}J`
                                                                        },
                                                                        {
                                                                            key: 2,
                                                                            laserParams: 'Pulse Duration',
                                                                            value: profile.data.diffuseReflectiveSP.pulseDuration.unit === false ? `${profile.data.diffuseReflectiveSP.pulseDuration.num} s` : `${profile.data.diffuseReflectiveSP.pulseDuration.num} ${profile.data.diffuseReflectiveSP.pulseDuration.unit}s`
                                                                        },
                                                                        {
                                                                            key: 3,
                                                                            laserParams: 'Beam Diameter',
                                                                            value: `${profile?.data?.diffuseReflectiveSP?.beamDiameter?.num}m`
                                                                        },
                                                                        {
                                                                            key: 4,
                                                                            laserParams: 'Distance to target',
                                                                            value: profile.data.diffuseReflectiveSP.distance.unit === false ? `${profile.data.diffuseReflectiveSP.distance.num} m` : `${profile.data.diffuseReflectiveSP.distance.num} ${profile.data.diffuseReflectiveSP.distance.unit}m`
                                                                        },
                                                                        {
                                                                            key: 5,
                                                                            laserParams: 'Beam Divergence',
                                                                            value: profile.data.diffuseReflectiveSP.beamDivergence.unit === false ? `${profile.data.diffuseReflectiveSP.beamDivergence.num} m` : `${profile.data.diffuseReflectiveSP.beamDivergence.num} ${profile.data.diffuseReflectiveSP.beamDivergence.unit}m`
                                                                        },
                                                                        {
                                                                            key: 6,
                                                                            laserParams: 'Albedo',
                                                                            value: `${profile.data.diffuseReflective.albedo.num} %`
                                                                        },
                                                                        {
                                                                            key: 7,
                                                                            laserParams: 'Distance2',
                                                                            value: profile.data.diffuseReflective.distance2.unit === false ? `${profile.data.diffuseReflective.distance2.num} m` : `${profile.data.diffuseReflective.distance2.num} ${profile.data.diffuseReflective.distance2.unit}m`
                                                                        }
                                                                    ])
                                                                }
                                                                else if (profile.data?.diffuseReflectiveRP !== undefined && profile.data?.diffuseReflectiveRP !== null) {
                                                                    return ([
                                                                        {
                                                                            key: 0,
                                                                            laserParams: 'Wavelength',
                                                                            value: `${profile.data?.diffuseReflectiveRP.wavelength.num} nm`
                                                                        },
                                                                        {
                                                                            key: 1,
                                                                            laserParams: (() => {
                                                                                if (profile.data.diffuseReflectiveRP.beamOutputUnit === 'peakPower') {
                                                                                    return 'Peak Power'
                                                                                } else if (profile.data.diffuseReflectiveRP.beamOutputUnit === 'averagePower') {
                                                                                    return 'Average Power'
                                                                                } else if (profile.data.diffuseReflectiveRP.beamOutputUnit === 'energy') {
                                                                                    return 'Energy'
                                                                                }
                                                                            })(),
                                                                            value: (() => {
                                                                                if (profile.data.diffuseReflectiveRP.beamOutputUnit === 'peakPower') {
                                                                                    return profile.data.diffuseReflectiveRP.peakPower.unit === false ? `${profile.data.diffuseReflectiveRP.peakPower.num} W` : `${profile.data.diffuseReflectiveRP.peakPower.num} ${profile.data.diffuseReflectiveRP.peakPower.unit}W`
                                                                                } else if (profile.data.diffuseReflectiveRP.beamOutputUnit === 'averagePower') {
                                                                                    return profile.data.diffuseReflectiveRP.averagePower.unit === false ? `${profile.data.diffuseReflectiveRP.averagePower.num} W` : `${profile.data.diffuseReflectiveRP.averagePower.num} ${profile.data.diffuseReflectiveRP.averagePower.unit}W`
                                                                                } else if (profile.data.diffuseReflectiveRP.beamOutputUnit === 'energy') {
                                                                                    return profile.data.diffuseReflectiveRP.energy.unit === false ? `${profile.data.diffuseReflectiveRP.energy.num} J` : `${profile.data.diffuseReflectiveRP.energy.num} ${profile.data.diffuseReflectiveRP.energy.unit}J`
                                                                                }
                                                                            })()
                                                                        },
                                                                        {
                                                                            key: 2,
                                                                            laserParams: 'Exposure Duration',
                                                                            value: profile.data.diffuseReflectiveRP.time.unit === false ? `${profile.data.diffuseReflectiveRP.time.num} s` : `${profile.data.diffuseReflectiveRP.time.num} ${profile.data.diffuseReflectiveRP.time.unit}s`
                                                                        },
                                                                        {
                                                                            key: 3,
                                                                            laserParams: 'Pulse Duration',
                                                                            value: profile.data.diffuseReflectiveRP.pulseDuration.unit === false ? `${profile.data.diffuseReflectiveRP.pulseDuration.num} s` : `${profile.data.diffuseReflectiveRP.pulseDuration.num} ${profile.data.diffuseReflectiveRP.pulseDuration.unit}s`
                                                                        },
                                                                        {
                                                                            key: 4,
                                                                            laserParams: 'Pulse Frequency',
                                                                            value: profile.data.diffuseReflectiveRP.pulseFrequency.unit === false ? `${profile.data.diffuseReflectiveRP.pulseFrequency.num} Hz` : `${profile.data.diffuseReflectiveRP.pulseFrequency.num} ${profile.data.diffuseReflectiveRP.pulseFrequency.unit}Hz`
                                                                        },
                                                                        {
                                                                            key: 5,
                                                                            laserParams: 'Beam Diameter',
                                                                            value: `${profile.data?.diffuseReflectiveRP.beamDiameter.num}m`
                                                                        },
                                                                        {
                                                                            key: 7,
                                                                            laserParams: 'Beam Divergence',
                                                                            value: profile.data.diffuseReflectiveRP.beamDivergence.unit === false ? `${profile.data.diffuseReflectiveRP.beamDivergence.num} m` : `${profile.data.diffuseReflectiveRP.beamDivergence.num} ${profile.data.diffuseReflectiveRP.beamDivergence.unit}m`
                                                                        },
                                                                        {
                                                                            key: 8,
                                                                            laserParams: 'Distance to target',
                                                                            value: profile.data.diffuseReflectiveRP.distance.unit === false ? `${profile.data.diffuseReflectiveRP.distance.num} m` : `${profile.data.diffuseReflectiveRP.distance.num} ${profile.data.diffuseReflectiveRP.distance.unit}m`
                                                                        },
                                                                        {
                                                                            key: 9,
                                                                            laserParams: 'Albedo',
                                                                            value: `${profile.data.diffuseReflective.albedo.num} %`
                                                                        },
                                                                        {
                                                                            key: 10,
                                                                            laserParams: 'Distance to target',
                                                                            value: profile.data.diffuseReflective.distance2.unit === false ? `${profile.data.diffuseReflective.distance2.num} m` : `${profile.data.diffuseReflective.distance2.num} ${profile.data.diffuseReflective.distance2.unit}m`
                                                                        },
                                                                    ])
                                                                }

                                                            })()
                                                        }
                                                    />
                                                </Flex>
                                            ),
                                            // extra: (
                                            //     <Popconfirm
                                            //         title='Delete this laser' description='Are you sure you want to delete this laser?'
                                            //         onConfirm={props.handleDeleteProfile}
                                            //         onCancel={null}
                                            //         okText='Delete'
                                            //         okButtonProps={
                                            //             {
                                            //                 value: profile.laserID,
                                            //                 loading: props.deleteIsLoading
                                            //             }
                                            //         }
                                            //         cancel='Cancel'
                                            //     >
                                            //         <Button
                                            //             type={'text'}
                                            //             icon={<DeleteOutlined />}
                                            //             value={profile.laserID}
                                            //             danger
                                            //         />
                                            //     </Popconfirm>
                                            // )
                                        }
                                    ]} />
                            )
                        }
                    )
                }
                )
            })()}
        />
    )
}

export default LaserProfile

import React from 'react'
const { useEffect, useState } = React;
import s from './calculcator.module.css'

import Input from '@mui/joy/Input';
import { Button } from 'antd'
import {CalculatorOutlined} from "@ant-design/icons";
import { Flex, Progress } from 'antd';
import { Spin } from 'antd';
import { Space, Typography } from 'antd';


function Calculator() {
    const [iob, setIob] = useState(0);
    const [pif, setPif] = useState(0);
    const [alfa, setAlfa] = useState(0);
    const [pds, setPds] = useState(0);
    const [iobTarget, setIobTarget] = useState(0);
    const [pifTarget, setPifTarget] = useState(0);
    const [pdsTarget, setPdsTarget] = useState(0);
    const [incentive, setIncentive] = useState(0);
    const [loading, setLoading] = useState(true);
    const formatProgress = (percent) => {
        return `${percent.toFixed(2)}%`; // Округляем до двух знаков после запятой
    };
    const { Text, Link } = Typography;
    useEffect(() => {
        // Проверяем, есть ли сохранённые данные в localStorage
        const storedIob = localStorage.getItem("iob");
        const storedPif = localStorage.getItem("pif");
        const storedAlfa = localStorage.getItem("alfa");
        const storedPds = localStorage.getItem("pds");
        const storedIobTarget = localStorage.getItem("iobTarget");
        const storedPifTarget = localStorage.getItem("pifTarget");
        const storedPdsTarget = localStorage.getItem("pdsTarget");

        // Если данные есть в localStorage, устанавливаем их в состояния
        if (storedIob) setIob(Number(storedIob));
        if (storedPif) setPif(Number(storedPif));
        if (storedAlfa) setAlfa(Number(storedAlfa));
        if (storedPds) setPds(Number(storedPds));
        if (storedIobTarget) setIobTarget(Number(storedIobTarget));
        if (storedPifTarget) setPifTarget(Number(storedPifTarget));
        if (storedPdsTarget) setPdsTarget(Number(storedPdsTarget));
    }, []);

    useEffect(() => {
        localStorage.setItem("iob", iob);
        localStorage.setItem("pif", pif);
        localStorage.setItem("alfa", alfa);
        localStorage.setItem("pds", pds);
        localStorage.setItem("iobTarget", iobTarget);
        localStorage.setItem("pifTarget", pifTarget);
        localStorage.setItem("pdsTarget", pdsTarget);
    }, [iob, pif, alfa, pds, iobTarget, pifTarget, pdsTarget]);
    useEffect(() => {
        setLoading(true); // Включаем загрузку
        setTimeout(() => {
            calculateIncentive(); // Например, считаем что-то
            setLoading(false); // Выключаем загрузку
        }, 1500)

    }, [iob, pif, alfa, iobTarget, pifTarget, pds, pdsTarget]);


    const calculateIncentive = () => {
        let pifBonusPercent = 0;
        let iobBonusPercent = 0;
        let alfaBonusPercent = 0;
        let pifDebounce = 0.9;
        let pdsDebounce = 0.8;

        let iobUpperDone = iob >  iobTarget ? (iob + alfa) - iobTarget : 0
        let pifUpperDone = pif > pifTarget ? pif - pifTarget : 0

        const iobRatio = (iob + alfa) / iobTarget;
        const pifRatio = pif / pifTarget;
        const pdsRatio = pds / pdsTarget

        // Рассчёт ИОБ бонуса
        if (iobRatio < 0.7) {
            iobBonusPercent = 0;
            alfaBonusPercent = 0;
        } else if (iobRatio < 0.9) {
            iobBonusPercent = 0.3;
            alfaBonusPercent = 0.4;
        } else {
            iobBonusPercent = 0.5;
            alfaBonusPercent = 0.6;
        }

        // Рассчёт ПИФ бонуса
        if (pifRatio < 0.8) {
            pifBonusPercent = 0;
            pifDebounce = 0.9;

        } else
        if (pifRatio >=0.8 && pifRatio <1) {
            pifBonusPercent = 0.4;
            pifDebounce = 0.9;
        } else {
            if (pifRatio >= 1) {
                pifDebounce = 1;
                pifBonusPercent = 0.4;
            }
        }

        if (pdsRatio>=1) {
            pdsDebounce = 1;
        }






        const totalDebounce = pdsDebounce * pifDebounce

        const incentiveWithOutDebounce = ((iob - iobUpperDone)*(iobBonusPercent / 100)) + (alfa * (alfaBonusPercent/100)) + iobUpperDone * (0.7/100) + ( (pif)*(pifBonusPercent/100)) + (pds*(0.6/100))

        const totalIncentive = incentiveWithOutDebounce * totalDebounce

        setIncentive(totalIncentive);
    };

    return (
        <div className={`pageContainer `}>
            <div className={s.calcFrame}>

            <Text strong className={s.textH1}>Калькулятор премии <CalculatorOutlined /></Text>

                <p><Text className = {s.value} strong>Введите план по месяцу:</Text></p>
            <label>
                <Text strong>ИОБ:</Text>
                <Input className = {s.input} type="number" value={iobTarget} onChange={(e) => setIobTarget(Number(e.target.value))} />
            </label>
            <br />

            <label>
                <Text strong>ПИФ:</Text>
                <Input className = {s.input} type="number" value={pifTarget} onChange={(e) => setPifTarget(Number(e.target.value))} />
            </label>
            <br />
            <label>
                <Text strong>ПДС:</Text>
                <Input className = {s.input} type="number" value={pdsTarget} onChange={(e) => setPdsTarget(Number(e.target.value))} />
            </label>
            <br />
                <p><Text className = {s.value} strong>Введите текущие показатели:</Text></p>
            <label>
                <Text strong>ИОБ:</Text>
                <Input className = {s.input} type="number" value={iob} onChange={(e) => setIob(Number(e.target.value))} />
                <Progress percent={(iob + alfa) / iobTarget * 100} size={{width: 445, height: 10}}  format={formatProgress}/>
            </label>
            <br />

            <label>
                <Text strong>СП АЛЬФА:</Text>
                <Input className = {s.input} type="number" value={alfa} onChange={(e) => setAlfa(Number(e.target.value))} />

            </label>
            <br />

            <label>
                <Text strong>ПИФ:</Text>
                <Input className = {s.input} type="number" value={pif} onChange={(e) => setPif(Number(e.target.value))} />
                <Progress percent={pif / pifTarget * 100} size={{width: 445, height: 10}}  format={formatProgress}/>
            </label>
            <br />
            <label>
                <Text strong>ПДС:</Text>
                <Input className = {s.input} type="number" value={pds}  onChange={(e) => setPds(Number(e.target.value))} />
                <Progress percent={pds / pdsTarget * 100} size={{width: 445, height: 10}}
                          format={formatProgress}  />
            </label>
            <br />

            <h3>{loading ? <Spin  size="large" /> : `Ваша премия: ${incentive.toFixed(2)} руб.`}</h3>


        </div>
        </div>
    );
}




export default Calculator
import React, { useState, useEffect } from "react";
import { useSpring, animated, to } from "@react-spring/web";
import { useDrag } from "react-use-gesture";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  @media only screen and (max-width: 500px) {
    width: 100%;
  }
`;

const PageDiv = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  text-align: center;
  flex-direction: column;
  display: flex;
  justify-content: space-between;
`;

const StyledSVG = styled.svg`
  position: absolute;
  height: 100%;
  width: 10px; //it makes the liquid swipe occuping less size, consequently making the UI under more accessable to interact.
`;

const PageContainer = styled.div`
  //it was creating a layer that was over the buttons.
`;

const StyledButton = styled(animated.button)`
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-family: "Oswald", sans-serif;
  background: transparent;
  color: ${(props) => props.color};
  border: 1px solid ${(props) => props.color};
  cursor: pointer;
  touch-action: pan-y;
  &::focus {
    outline: 0;
  }
  outline: none;
`;

const getPath = (y, x, width, height) => {
  const anchorDistance = 200 + x * 0.5;
  const curviness = anchorDistance - 60;
  return `M0, 
      ${height} 
      H0V0h${width}v 
      ${y - anchorDistance} 
      c0, 
      ${curviness} 
      , 
     ${x} 
      , 
      ${curviness} 
      , 
     ${x} 
      , 
      ${anchorDistance} 
      S${width}, 
      ${y} 
      ,${width}, 
      ${y + anchorDistance * 2}
      V
      ${height}
      z`;
};

const Page = ({ children, theme, index, setActive, gone = false }) => {
  const [isGone, setGone] = useState(gone);
  const [isMove, setMove] = useState(false);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const parent = document.getElementById("liquid-swipe-container");
    if (parent) {
      setWidth(parent.offsetWidth);
      setHeight(parent.offsetHeight);
      console.log(
        "setting width and height of" + parent + ": >>>",
        parent.offsetWidth,
        parent.offsetHeight
      );
    }
  }, []);

  const [{ posX, posY }, setPos] = useSpring(
    () => ({
      posX: -50,
      posY: height * 0.72 - 20,
      config: {
        mass: 3,
      },
    }),
    [height]
  );

  const [{ d }, setDvalue] = useSpring(
    () => ({
      d: gone
        ? getPath(0, 0, width, height)
        : getPath(height * 0.72, 0, 0, height),
      config: {
        mass: 3,
      },
      onRest: () => {
        if (isGone) {
          setDvalue(getPath(0, 0, width, height));
        }
      },
    }),
    [width, height]
  );

  useEffect(() => {
    if (!gone) {
      setDvalue({
        d: getPath(height * 0.72, 48, 5, height),
      });
      setTimeout(() => {
        setPos({
          posX: 7,
        });
      }, 100);
    }
  }, [gone, height]);

  const bind = useDrag(
    ({ down, movement: [mx], xy: [, my], vxvy: [vx] }) => {
      if (!isGone) {
        if (down && isMove) {
          setDvalue({
            d: getPath(my, mx + 60, 10, height),
          });
          setPos({
            posX: mx + 20,
            posY: my - 20,
          });
          if (mx > width / 2 || vx > 3) {
            setDvalue({
              d: getPath(my, -50, width, height),
            });
            setGone(true);
            setTimeout(() => {
              setDvalue({
                d: getPath(my, 0, width, height),
              });
              setActive(index);
            }, 240);
          }
        } else {
          setDvalue({
            d: getPath(height * 0.72, 48, 5, height),
          });
          setPos({
            posX: 7,
            posY: height * 0.72 - 20,
          });
        }
      }
    },
    { useTouch: width <= 813 }
  );
  return (
    <PageContainer id={`pageContainer${index}`} {...bind()}>
      <StyledSVG version="1.1" id="blob" xmlns="http://www.w3.org/2000/svg">
        <clipPath id={`clipping${index}`}>
          <animated.path id={`blob-path${index}`} d={d} />
        </clipPath>
      </StyledSVG>
      <PageDiv
        style={{
          clipPath: `url(#clipping${index})`,
          WebkitClipPath: `url(#clipping${index})`,
        }}
      >
        {children}
      </PageDiv>
      <StyledButton
        id={`button${index}`}
        color={theme}
        onMouseDown={() => {
          setMove(true);
        }}
        onMouseUp={() => {
          setMove(false);
        }}
        onTouchStart={() => {
          setMove(true);
        }}
        onTouchEnd={() => {
          setMove(false);
        }}
        style={{
          opacity: posX.to({
            range: [0, 100],
            output: [1, 0],
          }),
          transform: to(
            [
              posX.to((x) => `translateX(${x}px)`),
              posY.to((y) => `translateY(${y}px)`),
            ],
            (translateX, translateY) => `${translateX} ${translateY}`
          ),
        }}
      >
        {">"}
      </StyledButton>
    </PageContainer>
  );
};

export const LiquidSwipe = ({ components, colors }) => {
  const sizeOfSwipe = components.length;
  var keyMap = {};
  for (var i = 0; i < sizeOfSwipe - 1; i++) {
    keyMap[i] = i + 1;
  }
  keyMap[sizeOfSwipe - 1] = 0;

  const [isActive, setActive] = useState(0);
  const [elm, setElm] = useState([
    <Page
      key={0}
      index={0}
      setActive={setActive}
      gone={true}
      theme={colors[sizeOfSwipe - 1]}
    >
      {components[0]}
    </Page>,
  ]);

  useEffect(() => {
    const key = keyMap[isActive];
    if (elm.length === sizeOfSwipe - 1) {
      let skey = key - 1;
      if (key === 0) skey = sizeOfSwipe - 1;
      setTimeout(() => {
        setElm([
          ...elm.slice(1, sizeOfSwipe),
          <Page
            key={key}
            index={key}
            setActive={setActive}
            theme={colors[skey]}
          >
            {components[key]}
          </Page>,
        ]);
      }, 600);
    } else {
      setElm([
        ...elm,
        <Page
          key={key}
          index={key}
          setActive={setActive}
          theme={colors[key - 1]}
        >
          {components[key]}
        </Page>,
      ]);
    }
  }, [isActive]);
  return (
    <>
      <Container id="liquid-swipe-container">{elm}</Container>
    </>
  );
};
